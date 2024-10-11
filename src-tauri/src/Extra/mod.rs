pub mod Setup;

#[derive(Clone, serde::Serialize)]
pub struct TauriSendRendererPayload {
    pub event: String,
    pub extra: serde_json::Value,
}
