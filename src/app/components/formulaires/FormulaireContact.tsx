"use client";
import { CustomBtn } from "@/app/components/buttons/customButtons";
import { showToast } from "@/app/components/toast";
import { sendEmail } from "@/app/services/contact.actions";
import Form from "next/form";
import { useState } from "react";
import { useFormStatus } from "react-dom";
import { LuLoaderCircle } from "react-icons/lu";

export function FormulaireContact() {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    email: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const BtnSubmit = () => {
    const { pending } = useFormStatus();
    const isDisabled =
      pending ||
      !formData.lastName ||
      !formData.firstName ||
      !formData.email ||
      !formData.message;

    return (
      <CustomBtn
        type="submit"
        disabled={isDisabled}
        theme="submit"
        iconName="plane"
        size="sm"
      >
        {pending ? (
          <LuLoaderCircle size={28} className="animate-spin" />
        ) : (
          "Envoyer"
        )}
      </CustomBtn>
    );
  };

  const handleSubmit = async (formData: FormData) => {
    try {
      const response = await sendEmail(formData);

      if (response.success) {
        showToast("success", response.message);
        // Réinitialiser le formulaire après un succès
        setFormData({
          lastName: "",
          firstName: "",
          email: "",
          message: "",
        });
      } else {
        showToast("warn", response.message);
      }
    } catch {
      showToast(
        "error",
        "Une erreur est survenue lors de l'envoi du message ! 😔 Veuillez réessayer."
      );
    }
  };

  return (
    <Form
      action={handleSubmit}
      className="w-full max-w-[400px] flex flex-col gap-6"
    >
      <div className="w-full flex flex-col md:flex-row gap-6">
        <input
          type="text"
          name="lastName"
          id="lastName"
          placeholder="Nom"
          value={formData.lastName}
          onChange={handleChange}
          aria-label="Nom"
          className="custom-input"
          required
        />

        <input
          type="text"
          name="firstName"
          id="firstName"
          placeholder="Prénom"
          value={formData.firstName}
          onChange={handleChange}
          aria-label="Prénom"
          className="custom-input"
          required
        />
      </div>

      <input
        type="email"
        name="email"
        id="email"
        placeholder="email@exemple.com"
        value={formData.email}
        onChange={handleChange}
        aria-label="Email"
        className="custom-input"
        required
      />

      <div className="text-right">
        <textarea
          name="message"
          id="message"
          placeholder="Votre message..."
          className="custom-input w-full h-40"
          value={formData.message}
          onChange={handleChange}
          maxLength={500}
          aria-label="Message"
          style={{ resize: "none" }}
          required
        />
        <span className="text-sm text-muted-foreground">
          {formData.message.length}/500
        </span>
      </div>

      <div className="flex max-md:justify-center gap-4">
        <BtnSubmit />
      </div>
    </Form>
  );
}
