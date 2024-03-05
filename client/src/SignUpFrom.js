import { Button, styled, TextField } from "@mui/material";
import React, { useState } from "react";

const StyledTextField = styled(TextField)({
    margin: "1rem",
    width: "300px",
  });

const Form = (props) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e => {
    e.preventDefault();
    console.log(firstName, lastName, email, password);
    props.handleClose();
  });


  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <StyledTextField
        label="First Name"
        variant="filled"
        required
        value={firstName}
        onChange={(e) =>
          setFirstName(e.target.value)
        }
      />
      <StyledTextField
        label="Last Name"
        variant="filled"
        required
        value={lastName}
        onChange={(e) =>
          setLastName(e.target.value)
        }
      />
      <StyledTextField
        label="Email"
        type="email"
        variant="filled"
        required
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
      />
      <StyledTextField
        label="Password"
        type="password"
        variant="filled"
        required
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
      />
      <div>
        <Button variant="contained" sx={{ margin: "2rem" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          sx={{ margin: "2rem" }}
        >
          Signup
        </Button>
      </div>
    </form>
  );
};

export default Form;