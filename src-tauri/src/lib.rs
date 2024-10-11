#![allow(non_snake_case)]

mod Extra;

mod Addon;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
    .setup(Extra::Setup::Init)
    .invoke_handler(Addon::Generate())
    .run(tauri::generate_context!())
    .expect("error while building tauri application");
}
