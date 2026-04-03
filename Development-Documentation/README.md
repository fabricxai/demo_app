
# fabricXai-Garments Intelligent Platform

This is a code bundle for fabricXai-Garments Intelligent Platform. The original project is available at https://www.figma.com/design/vg4zhIRHKMDKSuC7sChWj4/fabricXai-Garments-Intelligent-Platform.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup (Optional)

The application currently uses hardcoded Supabase credentials and will work out of the box. However, for production deployments, it's recommended to use environment variables.

**For local development:**
1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Fill in your Supabase credentials in `.env.local`
3. See [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md) for detailed instructions

**Note:** All documentation files are now in the `Development-Documentation/` directory.

**Note:** The app will work without `.env.local` as it uses hardcoded values in `src/utils/supabase/info.tsx`.

### 3. Run Development Server

```bash
npm run dev
```

The application will start at `http://localhost:3000` (or the next available port).

## Documentation

- **[Environment Setup Guide](./ENV_SETUP_GUIDE.md)** - Complete guide for configuring environment variables
- **[Vercel Deployment Guide](./VERCEL_DEPLOYMENT_GUIDE.md)** - Step-by-step deployment to Vercel
- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Common issues and solutions
- **[Signup Test Guide](./SIGNUP_TEST_GUIDE.md)** - Testing the signup flow

## Project Structure

```
├── src/
│   ├── components/       # React components
│   ├── utils/            # Utility functions and Supabase integration
│   ├── assets/           # Images and static assets
│   └── supabase/         # Supabase Edge Functions
├── .env.example          # Environment variables template
├── vercel.json           # Vercel deployment configuration
└── vite.config.ts        # Vite build configuration
```

## Build for Production

```bash
npm run build
```

The build output will be in the `build/` directory.

## Deployment

See [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md) for detailed deployment instructions to Vercel.

## Environment Variables

The application supports the following environment variables (all optional, as values are currently hardcoded):

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous/public key
- `VITE_SUPABASE_PROJECT_ID` - Supabase project ID

See [ENV_SETUP_GUIDE.md](./ENV_SETUP_GUIDE.md) for complete documentation.

## Technologies Used

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Supabase** - Backend (Database, Auth, Edge Functions)
- **Tailwind CSS** - Styling
- **Radix UI** - UI components
- **Recharts** - Data visualization

## License

Private project - All rights reserved.
  