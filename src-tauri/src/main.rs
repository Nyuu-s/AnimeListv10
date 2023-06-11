

#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
mod path_helper;  
mod se_app_infos;
mod file_manager;
mod commands;
mod data_commands;
use data_commands::{
  saved_data, 
  check_current_data, 
  loading_data_status, 
  load_data, 
  init_session_state,
  get_data
};
use commands::{
  
  init_app_on_ready,
  import_file,
  safe_to_quit
};
use se_app_infos::{TauriConfig, DataFiles, InitialDataState};
use std::sync::Mutex;

fn main() {

  let context = tauri::generate_context!();
  let config = TauriConfig{config: context.config().clone()};
  let data_files_names = DataFiles::default();
  //Try to load existing data
  let initial_data_state =  load_data(&config, &data_files_names)
  .map(|msg| InitialDataState{message: Mutex::from(msg), status: Mutex::from(true)})
  .unwrap_or_else(|msg| InitialDataState{message: Mutex::from(msg), status: Mutex::from(false)});

  let session = init_session_state(&config, &data_files_names).expect("init session error");


tauri::Builder::default()
  .manage(config)
  .manage(data_files_names)
  .manage(initial_data_state)
  .manage(session)
  .invoke_handler(tauri::generate_handler![
    check_current_data, 
    import_file, 
    loading_data_status, 
    safe_to_quit, 
    init_app_on_ready, 
    saved_data,
    get_data
    ])
  .on_window_event( |event| match event.event() {
        tauri::WindowEvent::CloseRequested { api, .. } => {
          // Intercept closing app from shortcut + windows right click --> close
          api.prevent_close();
        }
        _ => {}
      })
  .run(context)
  .expect("error while running tauri application");

}


//TODO REFACTOR
// Extract function into modules
// Add function to get path and do the joins auto