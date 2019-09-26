import firebase from "firebase/app"
import "firebase/auth"
import "firebase/database"
import "firebase/firestore"

import { config } from "./config"
import { devEnv } from "@xcmats/js-toolbox"

if (devEnv() && window) window.firebase = firebase

export default firebase.initializeApp(config.firebase)
