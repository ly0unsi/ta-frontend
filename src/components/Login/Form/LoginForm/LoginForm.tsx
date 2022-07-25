import { Button, Input } from "components";
import { useEffect, useState } from "react";
import { BsArrowRightShort } from "react-icons/bs";
import { loginForm, signupForm } from "./forms";
import { useNavigate } from "react-router-dom";
import submitLogin from "utils/api/submitLogin";
import getProfile from "utils/api/getProfile";
import { UserModel } from "Models/UserModal";

function LoginForm() {
  // react router navigation
  const navigate = useNavigate();

  //signup/login page state
  const [Form, setForm] = useState<any>(loginForm)
  const [loginPage, setloginPage] = useState(true)

  // submitting state
  const [submitting, setSubmitting] = useState(false);

  // formData state
  const [formData, setFormData] = useState<UserModel>({
    username:"",
    firstname:"",
    lastname:"",
    email:"",
    password:"",
    confirmpassword:""
  });

  // error state
  const [error, setError] = useState<{
    global: string | null;
    username: string | null;
    password: string | null;
  }>({
    global: null,
    username: null,
    password: null,
  });

  // handle on submit
  const handleSubmit = () => {
    // setting global error to false
    setError({ ...error, global: null });

    // setting submitting to true
    setSubmitting(true);

    if (error.username || error.password) return setSubmitting(false);

    submitLogin(formData)
      .then(() => {
        setSubmitting(false);
        navigate("/settings");
      })
      .catch((err) => {
        setSubmitting(false);
        setError({
          ...error,
          global: err,
        });
      });
  };

  // on component mount, we will check if the user is already logged in
  useEffect(() => {
    const success = () => {
      // it means the user is already logged in, redirect to /settings!
      navigate("/settings");
    };

    getProfile(success, () => {});
  }, []);

  // on formData change
  useEffect(() => {
    // setting global error to null on input change
    setError({ ...error, global: null });
  }, [formData]);
  useEffect(() => {
   if (loginPage) {
     setForm(loginForm)
   }else{
    setForm(signupForm)
   }

  }, [loginPage])
  
  return (
    <div className="Login-form-wrapper-form w-full flex flex-col items-start">
      {error.global && (
        <div className="Login-form-wrapper-form-error">
          <p>{error.global}</p>
        </div>
      )}
      {
        Form.map((field:any, i: any) => (
          <Input
            key={i}
            type={field.type}
            HTMLtype={field.HTMLtype}
            name={field.name}
            label={field.label}
            subLabel={field.subLabel}
            required={field.required}
            placeholder={field.placeholder}
            error={error[field.name as keyof typeof error]}
            value={formData[field.name as keyof typeof formData]}
            onChange={(newValue: string | boolean) => {
              // setting new value
              setFormData({ ...formData, [field.name]: newValue });
  
              // checking if value is valid
              let notValid = field.validation(newValue as string);
  
              if (notValid) {
                setError({ ...error, [field.name]: notValid });
              } else {
                setError({ ...error, [field.name]: null });
              }
            }}
          />
        ))}:

      <span onClick={()=>setloginPage((prev)=>!prev) } className='cursor-pointer'>{loginPage ? "Dont have an account ? Sigup":"Already Have an account ? Login" }</span>
      <Button
        type="main"
        className="w-full"
        disabled={submitting}
        size="md"
        onClick={handleSubmit}
      >
        {!submitting ? (
          <>
            Submit
            <span>
              <BsArrowRightShort />
            </span>
          </>
        ) : (
          "Submitting..."
        )}
      </Button>
    </div>
  );
}


export default LoginForm;