

use tauri::{api::path, State};
use crate::se_app_infos::{TauriConfig, DataFiles, DirName};
use std::path::PathBuf;


pub fn get_app_dir_string(directory: DirName, ctx: &State<'_, TauriConfig>, filenames: State<'_, DataFiles>) -> Option<String>
{

 
  match directory {
    DirName::AppLocalData =>  path::app_local_data_dir(&ctx.config)
                                .unwrap()
                                .join(filenames.saved_data_dir)
                                .to_str().map(|s| s.to_string()),
    DirName::AppCache =>      path::app_cache_dir(&ctx.config)
                                .unwrap()
                                .join(filenames.cached_data_dir)
                                .to_str().map(|s| s.to_string()),
    DirName::AppBackup =>     path::app_local_data_dir(&ctx.config)
                                .unwrap()
                                .join(filenames.saved_data_dir) 
                                .join(filenames.backup_data_dir)
                                .to_str()
                                .map(|s| s.to_string()),
    DirName::Backup =>     path::app_local_data_dir(&ctx.config)
                                .unwrap()
                                .join(filenames.saved_data_dir) 
                                .join(filenames.backup_data_dir)
                                .join(filenames.backup_data)
                                .to_str()
                                .map(|s| s.to_string()),
    DirName::LocalData =>     path::app_local_data_dir(&ctx.config)
                                .unwrap()
                                .join(filenames.saved_data_dir)
                                .join(filenames.saved_data)
                                .to_str()
                                .map(|s| s.to_string()),
    DirName::Cache =>         path::app_cache_dir(&ctx.config)
                                .unwrap()
                                .join(filenames.cached_data_dir)
                                .join(filenames.cached_data)
                                .to_str()
                                .map(|s| s.to_string())
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
  }
  
}