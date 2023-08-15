

use serde_json;
use zstd;
use std::path::PathBuf;
use std::fs;
use std::io::{Read, Write};
use sha2::{Digest, Sha256};


use crate::se_app_infos::Configurations;



fn helper_compress( contents: &str) -> Result<Vec<u8>, String>
{

  // PARSE JSON INTO SERDE VALUE
  let json_value: serde_json::Value = serde_json::from_str(contents).map_err(|_| format!("Failed to compress JSON - Unable to transform string into json: "))?;
  //SERIALIZE DATA INTO A VEC
  let serialized_data = serde_json::to_vec(&json_value).map_err(|_| format!("Failed to compress JSON - Failed to serialize json "))?;
  //COMRPESS DATA
  let compressed_data = zstd::encode_all(&serialized_data[..], 1).map_err(|err| format!("Failed to compress JSON - Unable to Comrpess: {}", err))?;
  
  Ok(compressed_data) 

}

pub fn helper_write_file<T: AsRef<[u8]>>(content: &T, output_path: &str) -> Result<(), String>
{// USING ASREF ALLOW TO PASS EITHER A &str or a Vec<u8> as parameters

  let path = PathBuf::from(output_path);
  let parent_directory = path.parent().ok_or("Failed to write file - Invalid output path")?;
  if !parent_directory.exists()
  {
    
    fs::create_dir_all(&parent_directory).map_err(|_| format!("Failed to write file - Unable to create directory tree of path {}", parent_directory.to_string_lossy()))?;
  }
    let bytes = content.as_ref();

    //WRITE TO OUTPUT
    let mut output_file = fs::File::create(output_path).map_err(|err| format!("Failed to write file - Unable to create output file: {}", err))?;
    output_file.write_all(bytes).map_err(|err| format!("Failed to write file - Unable to write into file: {}", err))?;
    Ok(())
}

// pub fn compress_json_str(json_str: &str, output_path: &str) -> Result<Vec<u8>, String>
// {
//   //COMPRESS DATA
//   let compressed = helper_compress(json_str)?;
//   Ok(compressed)
// }

pub fn compress_json_file(file_path: &str) -> Result<Vec<u8>, String>
{
  //READ JSON FILE
  let mut contents = String::new();
  let mut file = fs::File::open(file_path).map_err(|_| format!("Failed to compress JSON - Unable to open file: {}", file_path))?;
  file.read_to_string(&mut contents).map_err(|_| format!("Failed to compress JSON - Unable to read File {}",file_path ))?;

  let compressed = helper_compress(&contents)?;
  //COMPRESS DATA
  Ok(compressed)
  
}

pub fn decompress_file_json(file_path: &str) -> Result<serde_json::Value, String>
{
  //READ THE COMPRESSED FILE
  let compressed_data = fs::read(file_path).map_err(|_| "Failed to read compressed data from file")?;
  
  // DECOMPRESS DATA
  let decompressed_data = zstd::decode_all(&compressed_data[..]).map_err(|err| format!("Failed to decompress data: {}", err))?;
  // DESERIALIZE DATA INTO SERDE VALUE
  let json_value: serde_json::Value = serde_json::from_slice(&decompressed_data).map_err(|_| "Failed to deserialize data into JSON")?;
  
  Ok(json_value)

}

pub fn write_json_file(str: String, file_path: &str) -> Result<(), String>
{
  let json_value: serde_json::Value = serde_json::from_str(&str).map_err(|_| format!("Failed to write json file - Could not parse to json"))?;

  helper_write_file(&serde_json::to_string(&json_value).unwrap().as_bytes(), file_path)?;

  Ok(())
  
}

pub fn write_config(filepath: &PathBuf, cfg: Configurations) -> Result<(), String> {
  match cfg {
      Configurations::Window(window_cfg) => {
        fs::write(filepath, window_cfg.to_byte_array()).expect("ooopsie");
      },
      Configurations::_User(_user_cfg) => {}
  }
  Ok(())
}

pub async fn calculate_file_hash(file_path: &str) -> Result<String, String> {

  // let mut file = fs::File::open(file_path)?;
  let buffer =  fs::read(file_path).map_err(|err| format!("path: {} error: {}",file_path, err))?;
  // file.read_to_end(&mut buffer)?;

  let mut hasher = Sha256::new();
  hasher.update(buffer);
  let hash_result = hasher.finalize();
  let hash = format!("{:x}", hash_result);

  Ok(hash.to_string())
}

pub fn get_file_metadata(file_path: &str) -> Result<(u64, std::time::SystemTime), String> {
    let metadata = fs::metadata(file_path).map_err(|_| format!("File not found {}", file_path))?;
    Ok((metadata.clone().len(), metadata.modified().unwrap()))
}
