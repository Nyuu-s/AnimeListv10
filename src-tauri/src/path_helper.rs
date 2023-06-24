

use tauri::{api::path, State};
use crate::se_app_infos::{TauriConfig, DataFiles, DirName};
use std::path::PathBuf;


pub fn get_app_dir_string(directory: DirName, ctx: &State<'_, TauriConfig>, filenames: State<'_, DataFiles>) -> Option<String>
{

 
  match directory {
    DirName::AppLocalData =>  get_app_dir_path(DirName::AppLocalData, ctx.config.clone(), &filenames)
                                .to_str().map(|s| s.to_string()),
    DirName::AppCache =>      get_app_dir_path(DirName::AppCache, ctx.config.clone(), &filenames)
                                .to_str().map(|s| s.to_string()),
    DirName::AppBackup =>     get_app_dir_path(DirName::AppBackup, ctx.config.clone(), &filenames)
                                .to_str()
                                .map(|s| s.to_string()),
    DirName::Backup =>     get_app_dir_path(DirName::Backup, ctx.config.clone(), &filenames)
                                .to_str()
                                .map(|s| s.to_string()),
    DirName::LocalData =>     get_app_dir_path(DirName::LocalData, ctx.config.clone(), &filenames)
                                .to_str()
                                .map(|s| s.to_string()),
    DirName::Cache =>         get_app_dir_path(DirName::Cache, ctx.config.clone(), &filenames)
                                .to_str()
                                .map(|s| s.to_string()),
    DirName::UserConfig =>     get_app_dir_path(DirName::UserConfig, ctx.config.clone(), &filenames)
                                .to_str()
                                .map(|s| s.to_string()),
    DirName::Config     =>     get_app_dir_path(DirName::Config, ctx.config.clone(), &filenames)
                                .to_str()
                                .map(|s| s.to_string()),
    DirName::WindowConfig =>    get_app_dir_path(DirName::WindowConfig, ctx.config.clone(), &filenames)
                                .to_str()
                                .map(|s| s.to_string()),
  }
  
}

pub fn get_app_dir_path(directory: DirName, config: tauri::Config, filenames: &DataFiles) -> PathBuf
{
 
  match directory {
    DirName::AppLocalData => path::app_local_data_dir(&config).unwrap().join(filenames.saved_data_dir),
    DirName::AppCache => path::app_cache_dir(&config).unwrap().join(filenames.cached_data_dir),
    DirName::AppBackup => path::app_local_data_dir(&config).unwrap().join(filenames.saved_data_dir).join(filenames.backup_data_dir),
    DirName::LocalData => path::app_local_data_dir(&config).unwrap().join(filenames.saved_data_dir).join(filenames.saved_data),
    DirName::Cache => path::app_cache_dir(&config).unwrap().join(filenames.cached_data_dir).join(filenames.cached_data),
    DirName::Backup => path::app_cache_dir(&config).unwrap().join(filenames.saved_data_dir).join(filenames.backup_data_dir).join(filenames.backup_data),
    DirName::UserConfig => path::app_config_dir(&config).unwrap().join(filenames.config_location_dir).join(filenames.user_config_location),
    DirName::Config => path::app_config_dir(&config).unwrap().join(filenames.config_location_dir),
    DirName::WindowConfig => path::app_config_dir(&config).unwrap().join(filenames.config_location_dir).join(filenames.window_config_location)
  }
  
}