

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
  save_data, 
  check_current_data, 
  loading_data_status, 
  load_data, 
  init_session_state,
  get_data, read_window_config,
  read_user_config,
  delete_all,
  save_stats_data,
  fetch_stats_data
};
use commands::{
  open_external_url,
  // init_app_on_ready,
  import_file,
  export_csv,
  export_xlsx,
  safe_to_quit,
  clean_on_quit,
  save_window_config
};

use se_app_infos::{TauriConfig, DataFiles, InitialDataState};
use tauri::{Manager, Position};
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

  let window_config = read_window_config(&config, &data_files_names).expect("error");

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
    clean_on_quit,
    export_csv,
    export_xlsx,
    delete_all,
    save_stats_data,
    fetch_stats_data,
    // init_app_on_ready, 
    save_data,
    get_data,
    open_external_url,
    save_window_config,
    read_user_config
    ])
    .setup(move |app|{
      let main_window = app.get_window("main").unwrap();
      main_window.set_size(tauri::Size::Physical(tauri::PhysicalSize { width: *window_config.window_sizex.lock().unwrap() as u32, height: *window_config.window_sizey.lock().unwrap() as u32 })).expect("failed to set window size");
      main_window.set_position(Position::Physical(tauri::PhysicalPosition { x: *window_config.window_posx.lock().unwrap() as i32, y: *window_config.window_posy.lock().unwrap() as i32 })).expect("failed to set window position");
      
      Ok(())
    })
  .on_window_event( |event| match event.event() {
        tauri::WindowEvent::CloseRequested { api, .. } => {
          // Intercept closing app from shortcut + windows right click --> close
          api.prevent_close();
        }
        _ => {}
      })
  .build(context).expect("Error while building the app")
  .run(|_app_handle, event| match event {
    tauri::RunEvent::Updater(updater_event) => {
      match updater_event {
        tauri::UpdaterEvent::UpdateAvailable { body, date, version } => {
          println!("update available {} {:?} {}", body, date, version);
        }
        tauri::UpdaterEvent::Pending => {
          println!("update is pending!");
        }
        tauri::UpdaterEvent::DownloadProgress { chunk_length, content_length } => {
          println!("downloaded {} of {:?}", chunk_length, content_length);
        }
        // Emitted when the download has finished and the update is about to be installed.
        tauri::UpdaterEvent::Downloaded => {
          println!("update has been downloaded!");
        }
        // Emitted when the update was installed. You can then ask to restart the app.
        tauri::UpdaterEvent::Updated => {
          println!("app has been updated");
        }
        // Emitted when the app already has the latest version installed and an update is not needed.
        tauri::UpdaterEvent::AlreadyUpToDate => {
          println!("app is already up to date");
        }
        // Emitted when there is an error with the updater. We suggest to listen to this event even if the default dialog is enabled.
        tauri::UpdaterEvent::Error(error) => {
          println!("failed to update: {}", error);
        }
      
      }
    }
    _ => {}
  });
 

}


//TODO REFACTOR
// Extract function into modules
// Add function to get path and do the joins auto