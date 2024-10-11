use tauri::command;

#[command]
pub fn GetTestInfo() -> String {
    String::from("Rust Info")
}
