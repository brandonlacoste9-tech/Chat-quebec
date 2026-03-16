import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface VerificationRequestParams {
  identifier: string;
  url: string;
  provider: {
    from: string;
  };
}

export async function sendVerificationRequest(params: VerificationRequestParams): Promise<void> {
  const { identifier, url, provider } = params;

  try {
    await resend.emails.send({
      from: provider.from || 'Parlons <noreply@parlons.ca>',
      to: [identifier],
      subject: `Ton lien magique pour Parlons 🍁`,
      text: text({ url }),
      html: html({ url }),
    });
  } catch (error) {
    console.error("Error sending verification email", error);
    throw new Error(`SEND_VERIFICATION_EMAIL_ERROR: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function html(params: { url: string }) {
  const { url } = params;

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@600&display=swap" rel="stylesheet">
  <style>
    body {
      background-color: #2C1A0E;
      margin: 0;
      padding: 0;
      font-family: 'Barlow', Arial, sans-serif;
      color: #F0E6CC;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      padding: 20px;
    }
    .card {
      background-color: #3D2514;
      border: 1px solid rgba(201, 168, 76, 0.3);
      border-radius: 16px;
      padding: 40px;
      text-align: center;
      position: relative;
    }
    .grain {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      opacity: 0.03;
      pointer-events: none;
      background-size: 200px 200px;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }
    h1 {
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      margin-bottom: 16px;
      color: #F0E6CC;
    }
    p {
      font-size: 16px;
      line-height: 1.6;
      color: #B89870;
      margin-bottom: 32px;
    }
    .brand-table {
      margin: 0 auto 30px auto;
    }
    .brand-icon {
      background-color: #C9A84C;
      border-radius: 8px;
      width: 44px;
      height: 44px;
      font-family: 'Playfair Display', serif;
      font-size: 24px;
      font-weight: 900;
      color: #2C1A0E;
      text-align: center;
      line-height: 44px;
    }
    .brand-name {
      font-family: 'Playfair Display', serif;
      font-size: 28px;
      font-weight: 700;
      color: #C9A84C;
      padding-left: 12px;
      text-decoration: none;
    }
    .button {
      display: inline-block;
      background-color: #C9A84C;
      color: #2C1A0E !important;
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 14px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-decoration: none;
      padding: 18px 32px;
      border-radius: 8px;
    }
    .stitch {
      border-top: 1px dashed rgba(201, 168, 76, 0.3);
      margin: 30px 0;
      height: 1px;
    }
    .footer {
      font-size: 11px;
      color: #7A6040;
      font-family: 'Barlow Condensed', sans-serif;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }
    .copyright {
      margin-top: 8px;
      font-size: 10px;
      color: #5A4530;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="grain"></div>
      
      <table border="0" cellpadding="0" cellspacing="0" class="brand-table">
        <tr>
          <td class="brand-icon">P</td>
          <td class="brand-name">Parlons</td>
        </tr>
      </table>

      <h1>Ton lien magique est arrivé 🍁</h1>
      <p>
        Clique sur le bouton ci-dessous pour entrer dans l'app.<br>
        Le lien expire dans 24 heures.
      </p>

      <a href="${url}" class="button">ENTRER DANS PARLONS →</a>

      <div class="stitch"></div>

      <div class="footer">
        Si t'as pas demandé ce lien, ignore ce courriel.
        <div class="copyright">© 2025 Parlons — L'IA du Québec</div>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

function text({ url }: { url: string }) {
  return `Entrer dans Parlons: ${url}\n\nSi vous n'avez pas demandé ce courriel, vous pouvez l'ignorer.\n© 2025 Parlons — L'IA du Québec`;
}
