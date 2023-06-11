
use tauri::State;
use crate::se_app_infos::SessionDataState;
use crate::se_app_infos::InitialDataState;
use crate::se_app_infos::TauriConfig;
use crate::se_app_infos::DataFiles;
use crate::se_app_infos::DirName;
use tauri::api::path;
use crate::path_helper::{get_app_dir_path};
use crate::file_manager::{decompress_file_json, helper_write_file, get_file_metadata};
use std::sync::Mutex;
use std::fs;

#[tauri::command]
pub fn saved_data(data_state: State<'_, SessionDataState>) -> Result<bool, String> {
  //calculate new hash code and save it in the data state
  //set is_unsaved false
  Ok(true)
}

#[tauri::command]
pub fn loading_data_status(state: tauri::State<'_, InitialDataState>) -> Result<String, String> {
  
  match state.status.lock().unwrap().to_owned() {
      true => Ok(state.message.lock().unwrap().to_string()) ,
      false => Err(state.message.lock().unwrap().to_string()),
  }

}

#[tauri::command]
pub fn check_current_data( ctx: State<'_, TauriConfig>,  filenames: State<'_, DataFiles>) -> Result<(), String> {
  
  let mut directory_path = path::app_local_data_dir(&ctx.config).ok_or("Invalid cache data path".to_string())?;
  directory_path = directory_path.join("Data");
  if directory_path.is_dir() {
    let file_path = directory_path.join(filenames.saved_data);
    if file_path.exists() {
      return Err("Data already imported".to_string());
    }
  } 
Ok(())
}

pub fn load_data( config: &TauriConfig, filenames: &DataFiles) -> Result<String, String>
{
  // check if data exist in the local app data folder.
  let path = get_app_dir_path(DirName::LocalData, config.config.clone(), filenames.clone());
  // let path = dir.join(filenames.saved_data);
  let output_path = get_app_dir_path(DirName::Cache, config.config.clone(),  filenames.clone());
  
  if path.exists()
  {
    
    let decomrpessed = decompress_file_json( path.to_str().unwrap())?;

    helper_write_file(&decomrpessed.to_string(), output_path.to_str().unwrap())?;
  }
  else {
    return Err("No Data found".to_string());
  }

  Ok("Done".to_string())

}

pub fn init_session_state(config: &TauriConfig,  data_files_names: &DataFiles) -> Result<SessionDataState, String> {
  let cache_path = get_app_dir_path(DirName::AppCache, config.config.clone(), &data_files_names);
  let backup_path = get_app_dir_path(DirName::AppBackup, config.config.clone(), &data_files_names);
  let json_path = get_app_dir_path(DirName::Cache, config.config.clone(), &data_files_names);
  if !cache_path.exists()
  {
    //Create mandatory directories if 1st launch (cache & data)
    fs::create_dir_all(cache_path).map_err(|err| format!("{}",err))?;
  }
  if !backup_path.exists()
  {
    //no need to create specific localdata because backup folder is inside localdata folder 
    fs::create_dir_all(backup_path).map_err(|err| format!("{}",err))?;

  }
  if !json_path.exists()
  {
    fs::File::create(&json_path).map_err(|err| format!("{}",err))?;
  }
  let (meta_size, meta_time) = get_file_metadata(json_path.to_str().unwrap()).unwrap_or_else(|str| {(0, std::time::SystemTime::now())});
  println!("default size {}", meta_size);

  // Initialize the session state for the json file


  Ok(
    SessionDataState
    {
      is_unsaved: Mutex::from(true),
      hashcode: Mutex::from(String::default()),
      size: Mutex::from(meta_size), //get real hashcode of file
      time: Mutex::from(meta_time)
    }
  )
}
