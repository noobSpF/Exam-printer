<a href="https://your-app-link.vercel.app/">
  <img alt="Exam Printer - Faculty of Science" src="https://your-app-link.vercel.app/opengraph-image.png">
  <h1 align="center">Exam Printer</h1>
</a>

<p align="center">
 A centralized system for managing and printing exams
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#demo"><strong>Demo</strong></a> ·
  <a href="#deploy-to-vercel"><strong>Deploy to Vercel</strong></a> ·
  <a href="#clone-and-run-locally"><strong>Clone and run locally</strong></a> ·
  <a href="#feedback-and-issues"><strong>Feedback and issues</strong></a>
  <a href="#more-supabase-examples"><strong>More Examples</strong></a>
</p>
<br/>

## Features

- Centralized system for managing and printing exams.
- Role-based access: Admin, Instructor, Exam Officer, Tech Unit.
- Built with [Next.js](https://nextjs.org) and [Supabase](https://supabase.io).
- Styling with [Tailwind CSS](https://tailwindcss.com).
- Optional deployment with [Vercel](https://vercel.com) for fast, scalable hosting.

## Demo

You can view a fully working demo at [exam-printer.vercel.app](https://your-app-link.vercel.app).

## Deploy to Vercel

Vercel deployment will guide you through creating a Supabase account and project.

After installation of the Supabase integration, all relevant environment variables will be assigned to the project so the deployment is fully functioning.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fexam-printer&project-name=exam-printer&repository-name=exam-printer&demo-title=Exam+Printer+App&demo-description=A+centralized+system+for+managing+and+printing+exams.&demo-url=https%3A%2F%2Fyour-app-link.vercel.app%2F&external-id=https%3A%2F%2Fgithub.com%2Fyour-username%2Fexam-printer)

The above will also clone the Exam Printer app to your GitHub, and you can clone that locally and develop locally.

If you wish to just develop locally and not deploy to Vercel, [follow the steps below](#clone-and-run-locally).

## Clone and run locally

1. You'll first need a Supabase project, which can be made [via the Supabase dashboard](https://app.supabase.com/).

2. Clone this repository:

   ```bash
   git clone https://github.com/your-username/exam-printer.git
   ```

3. Navigate into the app's directory:

   ```bash
   cd exam-printer
   ```

4. Rename `.env.example` to `.env.local` and update the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=[INSERT SUPABASE PROJECT URL]
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[INSERT SUPABASE PROJECT API ANON KEY]
   ```

   Both `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` can be found in [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. Install the dependencies:

   ```bash
   npm install
   ```

6. You can now run the Next.js local development server:

   ```bash
   npm run dev
   ```

   Should now be running on [localhost:3000](http://localhost:3000/).
