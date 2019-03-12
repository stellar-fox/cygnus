export const config = {
    api: "<deneb_api_uri>",
    apiV2: "<deneb_api_v2_uri>",
    federation: "<federation_server_domain i.e. localhost (dev only)>",
    horizon: "<horizon_uri>",
    network: "<network_passphrase>",
    firebase: {
        apiKey: "<firebase_api_key>",
        authDomain: "<firebase_auth_domain>",
        databaseURL: "<firebase_db_url>",
        projectId: "<firebase_project_id>",
        storageBucket: "<firebase_project_storage_bucket>",
        messagingSenderId: "<project_sender_id>",
    },
    assets: {
        codes: ["EUR", "USD", "AUD", "NZD", "THB", "PLN"],
        issuer: "<issuing_account_public_key>",
        avatar: "https://example.com/.well-known/logo.png",
        type: "asset_type_string",
    },
}
