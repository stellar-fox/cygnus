export const config = {
    api: "https://localhost:4001/api/v1",
    apiV2: "https://localhost:4001/api/v2",
    horizon: "https://horizon-testnet.stellar.org",
    reserve: "1",
    firebase: {
        apiKey: "<firebase_api_key>",
        authDomain: "<firebase_auth_domain>",
        databaseURL: "<firebase_db_url>",
        projectId: "<firebase_project_id>",
        storageBucket: "<firebase_project_storage_bucket>",
        messagingSenderId: "<project_sender_id>",
    },
    stripe: {
        apiKey: "<stripe_publishable_api_key>",
    },
    assets: {
        codes: ["EUR", "USD", "AUD", "NZD", "THB", "PLN",],
        issuer: "<issuing_account_public_key>",
        avatar: "https://example.com/.well-known/logo.png",
        type: "asset_type_string",
    },
}
