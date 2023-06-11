
use std::sync::Mutex;

pub struct TauriConfig {
  pub config: tauri::Config
}


pub struct DataFiles<'a> {
  pub cached_data: &'a str,
  pub saved_data: &'a str,
  pub backup_data: &'a str,
  pub saved_data_dir: &'a str,
  pub cached_data_dir: &'a str,
  pub backup_data_dir: &'a str,
  pub data_location: &'a str
  
}
impl<'a> Default for DataFiles<'a> {
  fn default() -> Self {
    DataFiles {
        cached_data: "AData.json", 
        saved_data: "PAData.zst" , 
        backup_data: "DEFAULT_PAData.zst", 
        saved_data_dir: "Data", 
        cached_data_dir: "Cache", 
        backup_data_dir: "Backup", 
        data_location: "Data" 
      }
  }
}

pub struct SessionDataState {
  pub is_unsaved: Mutex<bool>,
  pub hashcode: Mutex<String>,
  pub size: Mutex<u64>,
  pub  time: Mutex<std::time::SystemTime>
  
}
pub enum DirName {
  LocalData,
  Cache,
  Backup,
  AppBackup,
  AppLocalData,
  AppCache
}

#[derive(Default)]
pub struct InitialDataState {
  pub message: Mutex<String>,
  pub status: Mutex<bool>

}

#[derive(serde::Serialize)]
pub struct CustomResponse {
    pub status: bool,
    pub message: String,
}
