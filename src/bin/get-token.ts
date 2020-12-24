#!/usr/bin/env node

import dotenv from 'dotenv'
import { getVtexIdclientAutCookie } from '../index'

dotenv.config()

const {
  ACCOUNT_NAME = '',
  GOOGLE_AUTH_EMAIL = '',
  GOOGLE_AUTH_PASSWORD = ''
} = process.env

getVtexIdclientAutCookie(ACCOUNT_NAME, GOOGLE_AUTH_EMAIL, GOOGLE_AUTH_PASSWORD)
  .then(VtexIdclientAutCookie => {
    console.log(VtexIdclientAutCookie)
  })
