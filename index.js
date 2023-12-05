import express from "express"
import {google} from "googleapis"

const app = express()
app.set("view engine", "ejs")
app.use(express.urlencoded({extended: true}))

app.get("/", (req, res) => {
  res.render("index")
})

app.post("/", async (req, res) => {
  const {id, note} = req.body

  const auth = new google.auth.GoogleAuth({
    keyFile: "<credentials.json>",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  })

  const client = await auth.getClient()

  const googleSheets = google.sheets({version: "v4", auth: client})

  const spreadsheetId = "<2ByPimBnVru-FL0NYpdhTteblhE60PRvUBn9jRdOX6M8>" //example https://docs.google.com/spreadsheets/d/2ByPimBnVru-FL0NYpdhTteblhE60PRvUBn9jRdOX6M8/edit#gid=0

  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  })

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1"
  })

  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [
        [id, note]
      ]
    }
  })
  console.log("Noted!")
  res.redirect("/")
})

app.listen(1337, (req, res) => console.log("http://localhost:1337"))
