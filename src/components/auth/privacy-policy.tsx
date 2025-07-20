import React, { useEffect, useState } from "react";
import { Link, useTheme } from "@mui/material";
import { useMemo } from "react";

const PrivacyPolicy: React.FC = () => {
  const theme = useTheme();

  const privacyTexts = {
    en: {
      title: "Privacy Notice — Authentication and User Data",
      sections: [
        {
          heading: "1. Data Controller",
          content: (
            <>
              <p>
                The app team is the data controller responsible for processing
                your personal data collected through this application.
              </p>
              <p>
                You can contact us at:{" "}
                <Link className="emailLink" href="#"></Link>.
              </p>
            </>
          ),
        },
        {
          heading: "2. Personal Data Collected",
          content: (
            <>
              <p>
                When you register or sign in using Firebase Authentication, we
                collect and process the following personal data:
              </p>
              <ul>
                <li>Username</li>
                <li>Authentication tokens (securely handled by Firebase)</li>
                <li>User identifiers (e.g., user ID)</li>
              </ul>
              <p>
                Please note that your email address is{" "}
                <strong>not stored</strong> by us; it is used only by Firebase
                Authentication for login purposes.
              </p>
            </>
          ),
        },
        {
          heading: "3. Purpose and Legal Basis for Processing",
          content: (
            <>
              <p>We process your personal data to:</p>
              <ul>
                <li>
                  Authenticate your identity and provide secure access to the
                  services
                </li>
                <li>Manage your user account</li>
                <li>
                  Communicate with you regarding your account and service
                  updates
                </li>
              </ul>
              <p>
                The legal basis for processing is your consent and/or the
                necessity to perform the contract (Terms of Service) between you
                and us.
              </p>
            </>
          ),
        },
        {
          heading: "4. Data Processor",
          content: (
            <>
              <p>
                We use <strong>Firebase Authentication</strong>, a service
                provided by Google LLC, as the authentication provider. Firebase
                Authentication acts as a data processor on my behalf.
              </p>
              <p>
                Firebase Authentication processes your data according to
                Google’s{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Privacy Policy
                </a>{" "}
                and complies with GDPR.
              </p>
              <p>
                Data may be stored and processed in data centers located in the
                European Union or other regions, depending on Firebase’s
                infrastructure.
              </p>
            </>
          ),
        },
        {
          heading: "5. Data Retention",
          content: (
            <p>
              Your personal data will be retained as long as your account exists
              or as required to comply with legal obligations.
            </p>
          ),
        },
        {
          heading: "6. Your Rights",
          content: (
            <>
              <p>Under GDPR, you have the right to:</p>
              <ul>
                <li>Access your personal data</li>
                <li>Rectify inaccurate or incomplete data</li>
                <li>Request deletion of your data (account deletion)</li>
                <li>Restrict or object to processing</li>
                <li>Data portability</li>
                <li>
                  Withdraw consent at any time (without affecting the lawfulness
                  of prior processing)
                </li>
              </ul>
              <p>
                You have the right to delete your account and personal data at
                any time. You can do this easily through the user panel in the
                application. If you need assistance, please contact us at{" "}
                <Link className="emailLink" href="#"></Link>.
              </p>
            </>
          ),
        },
        {
          heading: "7. Security Measures",
          content: (
            <>
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal data, including:
              </p>
              <ul>
                <li>Secure authentication via Firebase Authentication</li>
                <li>Encrypted data transmission (HTTPS)</li>
                <li>Access controls and security rules on Firebase</li>
              </ul>
            </>
          ),
        },
        {
          heading: "8. Cookies and Tracking",
          content: (
            <>
              <p>
                This application uses browser storage technologies such as{" "}
                <strong>localStorage</strong> and <strong>IndexedDB</strong> to
                securely store authentication tokens and maintain your login
                session.
              </p>
              <p>
                We do <strong>not</strong> use cookies for authentication or
                tracking purposes.
              </p>
            </>
          ),
        },
        {
          heading: "9. Changes to This Privacy Notice",
          content: (
            <p>
              We may have to update this notice from time to time. We encourage
              you to review it periodically.
            </p>
          ),
        },
      ],
    },

    fr: {
      title:
        "Avis de confidentialité — Authentification et données utilisateur",
      sections: [
        {
          heading: "1. Responsable du traitement",
          content: (
            <>
              <p>
                L'équipe de l'application est responsable du traitement des
                données personnelles collectées via cette application.
              </p>
              <p>
                Vous pouvez nous contacter à :{" "}
                <Link className="emailLink" href="#"></Link>.
              </p>
            </>
          ),
        },
        {
          heading: "2. Données personnelles collectées",
          content: (
            <>
              <p>
                Lorsque vous vous inscrivez ou vous connectez via Firebase
                Authentication, nous collectons et traitons les données
                personnelles suivantes :
              </p>
              <ul>
                <li>Nom d'utilisateur</li>
                <li>
                  Jetons d'authentification (gérés en toute sécurité par
                  Firebase)
                </li>
                <li>Identifiants utilisateur (par exemple, ID utilisateur)</li>
              </ul>
              <p>
                Veuillez noter que votre adresse e-mail n'est{" "}
                <strong>pas stockée</strong> par nos soins : elle est uniquement
                utilisée par Firebase Authentication pour la connexion.
              </p>
            </>
          ),
        },
        {
          heading: "3. Finalité et base légale du traitement",
          content: (
            <>
              <p>Nous traitons vos données personnelles pour :</p>
              <ul>
                <li>
                  Authentifier votre identité et fournir un accès sécurisé aux
                  services
                </li>
                <li>Gérer votre compte utilisateur</li>
                <li>
                  Communiquer avec vous concernant votre compte et les mises à
                  jour du service
                </li>
              </ul>
              <p>
                La base légale du traitement est votre consentement et/ou la
                nécessité d'exécuter le contrat (Conditions d'utilisation) entre
                vous et nous.
              </p>
            </>
          ),
        },
        {
          heading: "4. Sous-traitant",
          content: (
            <>
              <p>
                Nous utilisons <strong>Firebase Authentication</strong>, un
                service fourni par Google LLC, comme fournisseur
                d'authentification. Firebase Authentication agit en tant que
                sous-traitant pour notre compte.
              </p>
              <p>
                Firebase Authentication traite vos données conformément à la{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  politique de confidentialité
                </a>{" "}
                de Google et respecte le RGPD.
              </p>
              <p>
                Les données peuvent être stockées et traitées dans des centres
                de données situés dans l'Union européenne ou dans d'autres
                régions, selon l'infrastructure de Firebase.
              </p>
            </>
          ),
        },
        {
          heading: "5. Conservation des données",
          content: (
            <p>
              Vos données personnelles seront conservées tant que votre compte
              existe ou selon les obligations légales.
            </p>
          ),
        },
        {
          heading: "6. Vos droits",
          content: (
            <>
              <p>Conformément au RGPD, vous avez le droit de :</p>
              <ul>
                <li>Accéder à vos données personnelles</li>
                <li>Rectifier des données inexactes ou incomplètes</li>
                <li>
                  Demander la suppression de vos données (suppression de compte)
                </li>
                <li>Restreindre ou vous opposer au traitement</li>
                <li>La portabilité des données</li>
                <li>
                  Retirer votre consentement à tout moment (sans affecter la
                  légalité du traitement antérieur)
                </li>
              </ul>
              <p>
                Vous avez le droit de supprimer votre compte et vos données
                personnelles à tout moment. Vous pouvez le faire facilement via
                le panneau utilisateur dans l’application. Si vous avez besoin
                d’aide, veuillez nous contacter à{" "}
                <Link className="emailLink" href="#"></Link>.
              </p>
            </>
          ),
        },
        {
          heading: "7. Mesures de sécurité",
          content: (
            <>
              <p>
                Nous mettons en œuvre des mesures techniques et
                organisationnelles appropriées pour protéger vos données
                personnelles, notamment :
              </p>
              <ul>
                <li>Authentification sécurisée via Firebase Authentication</li>
                <li>Transmission de données chiffrée (HTTPS)</li>
                <li>Contrôles d'accès et règles de sécurité sur Firebase</li>
              </ul>
            </>
          ),
        },
        {
          heading: "8. Cookies et suivi",
          content: (
            <>
              <p>
                Cette application utilise des technologies de stockage du
                navigateur telles que <strong>localStorage</strong> et{" "}
                <strong>IndexedDB</strong> pour stocker en toute sécurité les
                jetons d'authentification et maintenir votre session de
                connexion.
              </p>
              <p>
                Nous <strong>n'utilisons pas</strong> de cookies pour
                l'authentification ou le suivi.
              </p>
            </>
          ),
        },
        {
          heading: "9. Modifications de cet avis de confidentialité",
          content: (
            <p>
              Nous pouvons être amenés à mettre à jour cet avis de temps à
              autre. Nous vous encourageons à le consulter régulièrement.
            </p>
          ),
        },
      ],
    },
  };

  const [lang, setLang] = useState<"en" | "fr">("en");
  const { title, sections } = privacyTexts[lang];

  useEffect(() => {
    const user = "overwatchbuilds";
    const domain = "gmail.com";
    const links = document.getElementsByClassName(
      "emailLink"
    ) as HTMLCollectionOf<HTMLAnchorElement>;
    if (links.length > 0) {
      for (const link of links) {
        link.href = `mailto:${user}@${domain}`;
        link.textContent = `${user}@${domain}`;
      }
    }
  });

  return (
    <div
      style={{
        maxWidth: 800,
        margin: "auto",
        padding: 20,
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setLang("en")}
          disabled={lang === "en"}
          style={{ marginRight: 10 }}
        >
          English
        </button>
        <button onClick={() => setLang("fr")} disabled={lang === "fr"}>
          Français
        </button>
      </div>

      <h1>{title}</h1>

      {sections.map(({ heading, content }, idx) => (
        <section key={idx} style={{ marginBottom: 20 }}>
          <h2>{heading}</h2>
          {content}
        </section>
      ))}
    </div>
  );
};

<a href="mailto:overwatchbuilds@gmail.com">overwatchbuilds@gmail.com</a>;

export default PrivacyPolicy;
