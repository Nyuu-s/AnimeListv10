
use tauri::State;
use crate::se_app_infos::SessionDataState;
use crate::se_app_infos::InitialDataState;
use crate::se_app_infos::TauriConfig;
use crate::se_app_infos::DataFiles;
use crate::se_app_infos::DirName;
use crate::se_app_infos::UserConfig;
use crate::se_app_infos::WindowConfig;
use tauri::api::path;
use crate::path_helper::{get_app_dir_path, get_app_dir_string};
use crate::file_manager::{decompress_file_json, helper_write_file, get_file_metadata,calculate_file_hash};
use std::io::{BufReader, BufRead};

use std::sync::Mutex;
use std::fs;


#[derive(serde::Serialize, serde::Deserialize)]
struct Records {
  value: String,
  url: String,
}
#[derive(serde::Serialize, serde::Deserialize)]
struct JsonDataSection {
  objects: Vec<Records>
}

#[derive(serde::Serialize, serde::Deserialize)]
struct JsonData {
    headers: Vec<String>,
    data: Vec<JsonDataSection>
}



#[tauri::command]
pub async fn delete_all(ctx: State<'_, TauriConfig>,  filenames: State<'_, DataFiles<'_>>) -> Result<(), String> {
  let cache_path = get_app_dir_path(DirName::Cache, ctx.config.clone(), &filenames);
  let local_data_path = get_app_dir_path(DirName::LocalData, ctx.config.clone(), &filenames);
  fs::write(cache_path,"").map_err(|err| format!("{}", err))?;
  fs::remove_file(local_data_path).map_err(|_| format!("No data currently loaded."))?;
  Ok(())
}

#[tauri::command]
pub async fn save_data(data_state: State<'_, SessionDataState>, ctx: State<'_, TauriConfig>,  filenames: State<'_, DataFiles<'_>>, data: serde_json::Value) -> Result<bool, String> {
  //calculate new hash code and save it in the data state
  let data_path = get_app_dir_string(DirName::Cache, &ctx, filenames).unwrap();

  helper_write_file(&serde_json::to_string(&data).unwrap().as_bytes(), &data_path).map_err(|err| format!("{}", err))?;
  println!("previous hash: {}",data_state.hashcode.lock().unwrap());

  let hash = calculate_file_hash(&data_path).await.map_err(|err| format!("{}", err))?;
  let (new_size, new_time) = get_file_metadata(&data_path).map_err(|err| format!("{}", err))?;
  let mut modify_hashcode = data_state.hashcode.lock().unwrap();
  let mut modify_time = data_state.time.lock().unwrap();
  let mut modify_is_unsaved = data_state.is_unsaved.lock().unwrap();
  let mut modify_size = data_state.size.lock().unwrap();
  *modify_hashcode = hash;
  *modify_time = new_time;
  *modify_size = new_size;
  *modify_is_unsaved = false;
  //set is_unsaved false
  Ok(true)
}
#[tauri::command]
pub fn get_data(ctx: State<'_, TauriConfig>,  filenames: State<'_, DataFiles>) -> Result<serde_json::Value, String> {
  let data_path = get_app_dir_path(DirName::Cache, ctx.config.clone(), &filenames);
  let data_str =  fs::read_to_string(data_path).map_err(|err| format!{"{}", err})?;
  let data_json = serde_json::from_str(&data_str).map_err(|err| format!("{}", err))?;
  Ok(data_json)
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
  let path_data = get_app_dir_path(DirName::LocalData, config.config.clone(), filenames.clone());
  // let path = dir.join(filenames.saved_data);
  let output_path = get_app_dir_path(DirName::Cache, config.config.clone(),  filenames.clone());
   
  if path_data.exists() && (!output_path.exists() || output_path.metadata().unwrap().len() <= 0)
  {

      let decomrpessed = decompress_file_json( path_data.to_str().unwrap())?;
      helper_write_file(&decomrpessed.to_string(), output_path.to_str().unwrap())?;
    
  }
  else {
    return Err("No Data found".to_string());
  }

  Ok("Done".to_string())

}

#[tauri::command]
pub async fn read_user_config(ctx: State<'_, TauriConfig>,  data_files_names: State<'_, DataFiles<'_>>) -> Result<UserConfig, String> {
  let ucfg_path = get_app_dir_path(DirName::UserConfig, ctx.config.clone(), &data_files_names);
  let ucfg_file = std::fs::File::open(ucfg_path).map_err(|err| format!("{}", err))?;
  let reader = BufReader::new(ucfg_file);
  let user_cfg = UserConfig::default();
  for line in reader.lines()
  {
    let line = line.map_err(|err| format!("{}", err))?; 
    let (conext_var, value) = parse_cfg_line(&line, "=");
    match conext_var {
      "isAutoWSave" => {let mut is_auto_window_save  = user_cfg.is_auto_window_save.lock().unwrap(); *is_auto_window_save = value.parse::<bool>().map_err(|err| format!("{}", err))?},
      _ => () 
    }
  }
  Ok(user_cfg)
}


pub fn read_window_config(config: &TauriConfig,  data_files_names: &DataFiles) -> Result<WindowConfig, String> {

  let wcfg_path = get_app_dir_path(DirName::WindowConfig, config.config.clone(), &data_files_names);
  let wcfg_file = std::fs::File::open(wcfg_path).map_err(|err| format!("{}", err))?;
  let reader = BufReader::new(wcfg_file);

  let window_cfg = WindowConfig::default();

  for line in reader.lines()
  {
    let line = line.map_err(|err| format!("{}", err))?; 
    let (conext_var, value) = parse_cfg_line(&line, "=");

    match conext_var {
      "windowX" => {let mut window_posx =window_cfg.window_posx.lock().unwrap(); *window_posx = value.parse().map_err(|err| format!("{}", err))?},
      "windowY" => {let mut window_posx =window_cfg.window_posy.lock().unwrap(); *window_posx = value.parse().map_err(|err| format!("{}", err))?},
      "windowSizeX" => {let mut window_posx =window_cfg.window_sizex.lock().unwrap(); *window_posx = value.parse().map_err(|err| format!("{}", err))?},
      "windowSizeY" => {let mut window_posx =window_cfg.window_sizey.lock().unwrap(); *window_posx = value.parse().map_err(|err| format!("{}", err))?},
     
      _ => () 
    }
  }
  Ok(window_cfg)
}

fn parse_cfg_line<'a>(line:  &'a str, separator: &'a str) -> ( &'a str,  &'a str) {
  let mut parts = line.splitn(2, separator);
  let name = parts.next().unwrap_or("").trim();
  let value = parts.next().unwrap_or("").trim();
  (name, value)
}

pub fn init_session_state(config: &TauriConfig,  data_files_names: &DataFiles) -> Result<SessionDataState, String> {
  let cache_path = get_app_dir_path(DirName::AppCache, config.config.clone(), &data_files_names);
  let backup_path = get_app_dir_path(DirName::AppBackup, config.config.clone(), &data_files_names);
  let json_path = get_app_dir_path(DirName::Cache, config.config.clone(), &data_files_names);

  let cfg_dir_path = get_app_dir_path(DirName::Config, config.config.clone(), &data_files_names);
  let user_cfg = get_app_dir_path(DirName::UserConfig, config.config.clone(), &data_files_names);
  let win_cfg = get_app_dir_path(DirName::WindowConfig, config.config.clone(), &data_files_names);
  if !cfg_dir_path.exists()
  {
    fs::create_dir_all(cfg_dir_path.clone()).map_err(|err| format!("{}",err))?;
  }
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
  if !user_cfg.exists(){
    fs::File::create(user_cfg.clone()).map_err(|err| format!("{}",err))?;
  }
  if !win_cfg.exists()
  {
    fs::File::create(win_cfg.clone()).map_err(|err| format!("{}",err))?;
  }
  let (meta_size, meta_time) = get_file_metadata(json_path.to_str().unwrap()).unwrap_or_else(|_| {(0, std::time::SystemTime::now())});
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
