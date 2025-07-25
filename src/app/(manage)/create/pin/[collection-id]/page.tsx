"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { CardConfig } from "@/components/collections/pins-display/pin-card/types/card";
import { CardVariant } from "@/components/collections/pins-display/pin-card/types/cardVariant";

import { CreatePinRequest } from "@/lib/api-client/types/request";
import { PredefinedIcon } from "@/lib/types/predefinedIcon";

import { apiClient } from "@/lib/api-client/apiClient";

import styles from "./create-pin.module.scss";

const CreatePinForm: React.FC = () => {
  const router = useParams();
  const queryClient = useQueryClient();
  const { collectionId } = router;

  const [formData, setFormData] = useState<{
    description: string;
    cards: {
      order: string;
      caption: string;
      cardConfig: CardConfig;
    };
  }>({
    description: "",
    cards: {
      order: "1",
      caption: "",
      cardConfig: { variant: CardVariant.IMAGE, imageSrc: "" },
    },
  });

  const [cardVariant, setCardVariant] = useState<CardVariant>(
    CardVariant.IMAGE
  );
  const [iconType, setIconType] = useState<"custom" | "predefined">("custom");

  const createPinMutation = useMutation({
    mutationFn: async (pinData: CreatePinRequest) => {
      if (!collectionId || typeof collectionId !== "string") {
        throw new Error("Collection ID is required");
      }

      const response = await apiClient.pins.create(collectionId, pinData);

      if (!response.success) {
        throw new Error(response.message || "Failed to create pin");
      }

      return response;
    },
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["pins", collectionId] });
      queryClient.invalidateQueries({ queryKey: ["collections"] });
      console.log("res de onSuccess:", res);
    },
    onError: (error) => {
      console.error("Error creating pin:", error);
    },
  });

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("cards.")) {
      const cardField = field.replace("cards.", "");
      setFormData((prev) => ({
        ...prev,
        cards: {
          ...prev.cards,
          [cardField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleCardConfigChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      cards: {
        ...prev.cards,
        cardConfig: {
          ...prev.cards.cardConfig,
          [field]: value,
        },
      },
    }));
  };

  const handleCardVariantChange = (variant: CardVariant) => {
    setCardVariant(variant);

    if (variant === CardVariant.IMAGE) {
      setFormData((prev) => ({
        ...prev,
        cards: {
          ...prev.cards,
          cardConfig: { variant: CardVariant.IMAGE, imageSrc: "" },
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        cards: {
          ...prev.cards,
          cardConfig: {
            variant: CardVariant.LINK,
            icon: { type: "custom", src: "" },
            href: "",
          },
        },
      }));
    }
  };

  const handleIconTypeChange = (type: "custom" | "predefined") => {
    setIconType(type);

    const currentConfig = formData.cards.cardConfig;
    if (currentConfig.variant === CardVariant.LINK) {
      setFormData((prev) => ({
        ...prev,
        cards: {
          ...prev.cards,
          cardConfig: {
            ...currentConfig,
            icon:
              type === "custom"
                ? { type: "custom", src: "" }
                : { type: "predefined", icon: PredefinedIcon.TIKTOK },
          },
        },
      }));
    }
  };

  const handleFormSubmit = () => {
    const pinData: CreatePinRequest = {
      description: formData.description,
      cards: formData.cards,
    };

    createPinMutation.mutate(pinData);
  };

  return (
    <div className={styles.form}>
      <h2>Criar Novo Pin</h2>

      <div className={styles.formGroup}>
        <label htmlFor="description" className={styles.label}>
          Descrição *
        </label>
        <textarea
          id="description"
          className={styles.textarea}
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          required
          placeholder="Digite a descrição do pin..."
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cardOrder" className={styles.label}>
          Ordem do Card
        </label>
        <input
          id="cardOrder"
          type="text"
          className={styles.input}
          value={formData.cards.order}
          onChange={(e) => handleInputChange("cards.order", e.target.value)}
          placeholder="1"
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="cardCaption" className={styles.label}>
          Legenda do Card *
        </label>
        <input
          id="cardCaption"
          type="text"
          className={styles.input}
          value={formData.cards.caption}
          onChange={(e) => handleInputChange("cards.caption", e.target.value)}
          required
          placeholder="Digite a legenda do card..."
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Tipo de Card *</label>
        <div className={styles.radioGroup}>
          <div className={styles.radioOption}>
            <input
              type="radio"
              id="image"
              name="cardVariant"
              value={CardVariant.IMAGE}
              checked={cardVariant === CardVariant.IMAGE}
              onChange={() => handleCardVariantChange(CardVariant.IMAGE)}
            />
            <label htmlFor="image">Imagem</label>
          </div>
          <div className={styles.radioOption}>
            <input
              type="radio"
              id="link"
              name="cardVariant"
              value={CardVariant.LINK}
              checked={cardVariant === CardVariant.LINK}
              onChange={() => handleCardVariantChange(CardVariant.LINK)}
            />
            <label htmlFor="link">Link</label>
          </div>
        </div>
      </div>

      {cardVariant === CardVariant.IMAGE && (
        <div className={styles.formGroup}>
          <label htmlFor="imageSrc" className={styles.label}>
            URL da Imagem *
          </label>
          <input
            id="imageSrc"
            type="url"
            className={styles.input}
            value={(formData.cards.cardConfig as any).imageSrc || ""}
            onChange={(e) => handleCardConfigChange("imageSrc", e.target.value)}
            required
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>
      )}

      {cardVariant === CardVariant.LINK && (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="href" className={styles.label}>
              URL do Link *
            </label>
            <input
              id="href"
              type="url"
              className={styles.input}
              value={(formData.cards.cardConfig as any).href || ""}
              onChange={(e) => handleCardConfigChange("href", e.target.value)}
              required
              placeholder="https://exemplo.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Tipo de Ícone</label>
            <div className={styles.radioGroup}>
              <div className={styles.radioOption}>
                <input
                  type="radio"
                  id="custom"
                  name="iconType"
                  value="custom"
                  checked={iconType === "custom"}
                  onChange={() => handleIconTypeChange("custom")}
                />
                <label htmlFor="custom">Personalizado</label>
              </div>
              <div className={styles.radioOption}>
                <input
                  type="radio"
                  id="predefined"
                  name="iconType"
                  value="predefined"
                  checked={iconType === "predefined"}
                  onChange={() => handleIconTypeChange("predefined")}
                />
                <label htmlFor="predefined">Predefinido</label>
              </div>
            </div>
          </div>

          {iconType === "custom" && (
            <div className={styles.formGroup}>
              <label htmlFor="iconSrc" className={styles.label}>
                URL do Ícone Personalizado
              </label>
              <input
                id="iconSrc"
                type="url"
                className={styles.input}
                value={(formData.cards.cardConfig as any).icon?.src || ""}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    cards: {
                      ...prev.cards,
                      cardConfig: {
                        ...prev.cards.cardConfig,
                        icon: { type: "custom", src: e.target.value },
                      },
                    },
                  }));
                }}
                placeholder="https://exemplo.com/icon.svg"
              />
            </div>
          )}

          {iconType === "predefined" && (
            <div className={styles.formGroup}>
              <label htmlFor="predefinedIcon" className={styles.label}>
                Ícone Predefinido
              </label>
              <select
                id="predefinedIcon"
                className={styles.select}
                value={
                  (formData.cards.cardConfig as any).icon?.icon ||
                  PredefinedIcon.PINTEREST
                }
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    cards: {
                      ...prev.cards,
                      cardConfig: {
                        ...prev.cards.cardConfig,
                        icon: {
                          type: "predefined",
                          icon: e.target.value as PredefinedIcon,
                        },
                      },
                    },
                  }));
                }}
              >
                <option value={PredefinedIcon.X}>X</option>
                <option value={PredefinedIcon.TWITCH}>Twitch</option>
                <option value={PredefinedIcon.YOUTUBE}>Youtube</option>
                <option value={PredefinedIcon.PINTEREST}>Pinterest</option>
              </select>
            </div>
          )}
        </>
      )}

      {createPinMutation.isError && (
        <div className={styles.error}>
          Erro ao criar pin: {createPinMutation.error?.message}
        </div>
      )}

      <div className={styles.buttonGroup}>
        <button
          type="button"
          className={`${styles.button} ${styles.cancelButton}`}
          disabled={createPinMutation.isPending}
        >
          Cancelar
        </button>
        <button
          type="button"
          className={`${styles.button} ${styles.submitButton}`}
          onClick={handleFormSubmit}
          disabled={createPinMutation.isPending}
        >
          {createPinMutation.isPending ? "Criando..." : "Criar Pin"}
        </button>
      </div>
    </div>
  );
};

export default CreatePinForm;
