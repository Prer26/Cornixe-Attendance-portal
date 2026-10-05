import { loginEmployee } from "./api";

loginEmployee("preranacornixe@cornixe.in")
  .then((result) => {
    console.log("Cornixe API Response:", result);
  });