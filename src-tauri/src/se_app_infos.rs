
use std::{sync::Mutex};
use serde::Serialize;
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
  pub data_location: &'a str,
  pub config_location_dir: &'a str,
  pub user_config_location: &'a str,
  pub window_config_location:  &'a str
  
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
        data_location: "Data" ,
        config_location_dir: "Config",
        user_config_location: "UProperty.cfg",
        window_config_location:  "Window.cfg"
      }
  }
}



pub struct SessionDataState {
  pub is_unsaved: Mutex<bool>,
  pub hashcode: Mutex<String>,
  pub size: Mutex<u64>,
  pub  time: Mutex<std::time::SystemTime>
  
}

pub struct WindowConfig {
  pub window_posx: Mutex<f64>,
  pub window_posy: Mutex<f64>,
  pub window_sizex: Mutex<f64>,
  pub window_sizey: Mutex<f64>
}

impl WindowConfig {
  // Define the constructor-like function
 pub fn new(px: f64, py: f64, sx: f64, sy: f64) -> Self {
      Self {
        window_posx: Mutex::from(px),
        window_posy: Mutex::from(py),
        window_sizex: Mutex::from(sx),
        window_sizey: Mutex::from(sy)
      }
  }

  pub fn to_byte_array(&self) -> Vec<u8> {
    let value1 = *self.window_posx.lock().unwrap();
    let value2 = *self.window_posy.lock().unwrap();
    let value3 = *self.window_sizex.lock().unwrap();
    let value4 = *self.window_sizey.lock().unwrap();

    let formatted_string = format!("windowX={}\nwindowY={}\nwindowSizeX={}\nwindowSizeY={}",
                                  value1, value2, value3, value4);
    formatted_string.into_bytes()
  }



}

impl Default for WindowConfig {
   fn default() -> Self {
    Self {
      window_posx: Mutex::from(0f64),
      window_posy: Mutex::from(0f64),
      window_sizex: Mutex::from(800f64),
      window_sizey: Mutex::from(800f64)
    }
  }
}

#[derive(Serialize)]
pub struct UserConfig {
  //todo: add user config fields like color theme, notification pref and so on,
  pub is_auto_window_save: Mutex<bool>
}

impl Default for UserConfig {
  fn default() -> Self {
   Self {
    is_auto_window_save: Mutex::from(true),
   }
 }
}

pub enum Configurations {
    Window(WindowConfig),
    User(UserConfig)
}

pub enum DirName {
  LocalData,
  Cache,
  Backup,
  AppBackup,
  AppLocalData,
  AppCache,
  Config,
  UserConfig,
  WindowConfig
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
