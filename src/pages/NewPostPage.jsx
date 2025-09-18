// src/pages/NewPostPage.jsx
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NewPostModal from "../components/newpost/NewPostModal";

export default function NewPostPage() {
    const [open, setOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    const close = () => {
        setOpen(false);
        // If we have history, go back; otherwise go home
        if (location.key !== "default") navigate(-1);
        else navigate("/");
    };

    // Ensure modal opens when this route is hit
    useEffect(() => setOpen(true), []);

    return <NewPostModal open={open} onClose={close} />;
}
