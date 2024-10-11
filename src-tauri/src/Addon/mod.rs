use tauri::generate_handler;
mod Message;

pub fn Generate() -> impl Fn(tauri::ipc::Invoke) -> bool {
    generate_handler![Message::GetTestInfo]
}
