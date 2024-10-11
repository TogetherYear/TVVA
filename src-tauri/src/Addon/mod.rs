use tauri::generate_handler;

pub fn Generate() -> impl Fn(tauri::ipc::Invoke) -> bool {
    generate_handler![]
}
