

use tauri::State;
use crate::se_app_infos::{DataFiles, TauriConfig, SessionDataState, CustomResponse ,DirName};
use crate::path_helper::{get_app_dir_path, get_app_dir_string};
use crate::file_manager::{calculate_file_hash, write_json_file, compress_json_file, helper_write_file , get_file_metadata};

use std::process::Command;



#[tauri::command]
pub async fn init_app_on_ready(data_state: State<'_, SessionDataState>, filenames: State<'_, DataFiles<'_>>, ctx: State<'_, TauriConfig>) -> Result<(), String> {
  let json_path = get_app_dir_path(DirName::Cache, ctx.config.clone(), &filenames);
  let hashcode = calculate_file_hash(json_path.to_str().unwrap()).await.map_err(|err| format!("{}", err))?;
  let mut data_guard = data_state.hashcode.lock().unwrap();
  *data_guard = hashcode;
  
    Ok(())
}

#[tauri::command]
pub fn import_file(data_file_path: String,  ctx: State<'_, TauriConfig>, filenames: State<'_, DataFiles> ) -> Result<serde_json::Value, String> {
  
  let script_path = "python/script.py";

  let cache_path = get_app_dir_string(DirName::Cache, &ctx, filenames.clone()).ok_or("Invalid cache path".to_string())?;
  
    //FILE TO BE SAVED EACH TIME APP CLOSES
    let compressed_json_file_path = get_app_dir_string(DirName::LocalData, &ctx, filenames.clone()).ok_or("Invalid local data path".to_string())?;

    //FILE TO RECOVER 
    let backup_compressed_json_file_path = get_app_dir_string(DirName::Backup, &ctx, filenames.clone()).ok_or("Invalid local data path".to_string())?;

  match execute_python_script(script_path, &data_file_path) {
      Ok(json_str ) => {
        
        //Write json file in cache directory, to be edited, modified etc
        //And write a compressed json file in the data directory, will be used for persistance
        //Todo Save extra copy of compressed as ultimate backup for a potential reset of the json
        let result_value = serde_json::Value::from(json_str.clone());
        write_json_file(json_str, &cache_path)?;
        let data = compress_json_file(&cache_path)?;
        helper_write_file(&data, &compressed_json_file_path)?;
        helper_write_file(&data, &backup_compressed_json_file_path)?;
        Ok(result_value)
      },
      Err(e) => Err(e.to_string()),
  }
  
}


#[tauri::command]
pub async fn safe_to_quit(data_state: State<'_, SessionDataState>, ctx: State<'_, TauriConfig>, filenames: State<'_, DataFiles<'_>>) -> Result<bool, CustomResponse> {
  let error = "Unsaved changes detected, do you want to quit without saving ? ".to_string();
  let saved = data_state.is_unsaved.lock().unwrap().clone();
  let cached_file_path = get_app_dir_path(DirName::Cache, ctx.config.clone(), &filenames);

  let (current_size, current_time) = 
     get_file_metadata(cached_file_path.to_str().unwrap())
    .map_err(|err| CustomResponse{status: false, message: format!("{}", err)})?;
  let current_hashcode = calculate_file_hash(cached_file_path.to_str().unwrap()).await.map_err(|err| CustomResponse{status: false, message: format!("HashError: {}", err)})?;
 
  println!("guard 1: Time from app launch is greater than last edited time of file {}", data_state.time.lock().unwrap().ge(&current_time));
  
  //guard if stored time is bigger or equal then data saved --> user can quit
  if data_state.time.lock().unwrap().ge(&current_time)
  {
    return Ok(saved)
  }
  println!("guard 2: Size of file is the same  {} ", data_state.size.lock().unwrap().eq(&current_size));
  println!("current size {} -- Saved size {}", &current_size, data_state.size.lock().unwrap());
  //guard if file size is equal then data saved --> user can quit
  if data_state.size.lock().unwrap().eq(&current_size)
  {
    return Ok(saved)
  }
  // if hashcode is any diff than data not saved --> user will have prompt
  if !data_state.hashcode.lock().unwrap().eq(&current_hashcode)
  {
    println!("guard 3: Hashcodes are different {} ", !data_state.hashcode.lock().unwrap().eq(&current_hashcode));
    return Err(CustomResponse{status: true, message: error})
  }
  Ok(saved)
}




fn execute_python_script(script_path: &str, file_path: &str) -> Result<String, Box<dyn std::error::Error>> {
 
  let output = Command::new("python")
      .arg(script_path)
      .arg(file_path)
      .output()?;
  if output.status.success() {
      let output_str = String::from_utf8(output.stdout)?;

      Ok(output_str)
  } else {
      let error_str = String::from_utf8(output.stderr)?;
      Err(format!("Script execution failed: {}", error_str).into())
  }
}





