export const en = {
  // ─── Common UI elements ────────────────────────────────────────
  common: {
    copy:          "Copy",
    copied:        "Copied!",
    download:      "Download",
    share:         "Share",
    cancel:        "Cancel",
    delete:        "Delete",
    edit:          "Edit",
    save:          "Save",
    close:         "Close",
    loading:       "Loading...",
    error:         "Error",
    tryAgain:      "Try again",
    learnMore:     "Learn more",
    getStarted:    "Get started",
    viewAll:       "View all",
    showMore:      "Show more",
    showLess:      "Show less",
    comingSoon:    "Coming soon",
    free:          "Free",
    new:           "New",
    beta:          "Beta",
    active:        "Active",
    inactive:      "Inactive",
    yes:           "Yes",
    no:            "No",
    or:            "or",
    and:           "and",
    optional:      "Optional",
    required:      "Required",
  },

  // ─── Navigation ────────────────────────────────────────────────
  nav: {
    home:          "Home",
    dashboard:     "Dashboard",
    analytics:     "Analytics",
    pricing:       "Pricing",
    login:         "Sign In",
    logout:        "Sign Out",
    signUp:        "Sign Up Free",
    openMenu:      "Open menu",
    closeMenu:     "Close menu",
  },

  // ─── Landing page ──────────────────────────────────────────────
  landing: {
    hero: {
      badge:         "Free URL Shortener",
      title:         "Shorten your links in seconds",
      subtitle:      "Create short, shareable URLs with click analytics and QR codes — free forever. No signup required.",
      placeholder:   "Paste your long URL here... (e.g. https://example.com/very/long/path)",
      button:        "Shorten URL",
      buttonLoading: "Shortening...",
      hint:          "No account required. Start shortening instantly.",
    },
    result: {
      title:         "Your link is ready! 🎉",
      shortLink:     "Your short link",
      copyButton:    "Copy link",
      qrCodeTitle:   "QR Code",
      qrDownload:    "Download QR",
      showQr:        "Show QR code",
      hideQr:        "Hide QR code",
      createAnother: "Shorten another URL",
      signUpCta:     "Sign up to track clicks →",
    },
    features: {
      title:    "Everything you need to share smarter",
      subtitle: "Powerful link management built for creators, marketers, and businesses.",
      items: {
        fast: {
          title: "Lightning Fast Redirects",
          desc:  "Links redirect in under 30ms globally via Cloudflare edge network — your audience never waits.",
        },
        analytics: {
          title: "Real-Time Analytics",
          desc:  "Track clicks, geographic data, device types, and referral sources with a beautiful dashboard.",
        },
        qr: {
          title: "Instant QR Codes",
          desc:  "Every short link includes a downloadable QR code. Perfect for print materials and events.",
        },
        free: {
          title: "Free Forever",
          desc:  "Create links without an account. Sign up to unlock analytics, custom slugs, and more.",
        },
      },
    },
    howItWorks: {
      title:    "How it works",
      subtitle: "Three steps to a shorter, smarter link.",
      steps: {
        one: {
          number: "1",
          title:  "Paste your URL",
          desc:   "Drop any long URL into the input field above — no matter how long.",
        },
        two: {
          number: "2",
          title:  "Get your short link",
          desc:   "We instantly generate a unique 7-character short link for you.",
        },
        three: {
          number: "3",
          title:  "Share anywhere",
          desc:   "Copy the link, share via QR code, or post it on social media.",
        },
      },
    },
    cta: {
      title:    "Ready for full analytics?",
      subtitle: "Sign up free to track every click, manage all your links, and unlock custom slugs.",
      button:   "Create your free account",
      note:     "No credit card required. Free plan includes unlimited links.",
    },
  },

  // ─── Auth pages ────────────────────────────────────────────────
  auth: {
    signIn: {
      title:               "Welcome back",
      subtitle:            "Sign in to your SnapLinks account",
      googleButton:        "Continue with Google",
      divider:             "or continue with email",
      emailLabel:          "Email address",
      emailPlaceholder:    "you@example.com",
      passwordLabel:       "Password",
      passwordPlaceholder: "Your password",
      submitButton:        "Sign in",
      forgotPassword:      "Forgot password?",
      noAccount:           "Don't have an account?",
      signUpLink:          "Sign up free",
    },
    signUp: {
      title:               "Create your account",
      subtitle:            "Start shortening and tracking links for free",
      googleButton:        "Sign up with Google",
      divider:             "or sign up with email",
      emailLabel:          "Email address",
      emailPlaceholder:    "you@example.com",
      passwordLabel:       "Password",
      passwordPlaceholder: "Create a strong password",
      submitButton:        "Create account",
      hasAccount:          "Already have an account?",
      signInLink:          "Sign in",
      terms:               "By signing up, you agree to our Terms of Service and Privacy Policy.",
    },
    callback: {
      loading: "Completing sign in...",
      error:   "Authentication failed. Please try again.",
    },
  },

  // ─── Dashboard ─────────────────────────────────────────────────
  dashboard: {
    title:             "My Links",
    subtitle:          "Manage and track all your short links.",
    emptyTitle:        "No links yet",
    emptySubtitle:     "Create your first short link and start tracking clicks.",
    createButton:      "Create link",
    searchPlaceholder: "Search by title or URL...",
    totalLinks:        "Total Links",
    totalClicks:       "Total Clicks",
    link: {
      copyLink:       "Copy short link",
      viewAnalytics:  "View analytics",
      editLink:       "Edit link",
      toggleActive:   "Toggle link status",
      deleteLink:     "Delete link",
      confirmDelete:  "Delete this link?",
      deleteWarning:  "This action cannot be undone. All click history will be permanently lost.",
      deleteButton:   "Yes, delete",
      clicks:         "clicks",
      created:        "Created",
      lastClick:      "Last click",
    },
    create: {
      title:            "Shorten a new link",
      urlLabel:         "Destination URL",
      urlPlaceholder:   "https://your-long-url.com/path",
      titleLabel:       "Link title",
      titlePlaceholder: "e.g. My blog post (optional)",
      slugLabel:        "Custom slug",
      slugPlaceholder:  "my-custom-slug (optional)",
      slugHint:         "Leave empty to auto-generate a 7-character slug.",
      submitButton:     "Create link",
    },
  },

  // ─── Analytics ─────────────────────────────────────────────────
  analytics: {
    title:        "Link Analytics",
    totalClicks:  "Total Clicks",
    last24h:      "Last 24 Hours",
    last7d:       "Last 7 Days",
    last30d:      "Last 30 Days",
    clicksByHour: "Clicks by Hour of Day",
    clicksByDay:  "Clicks Over Time",
    topCountries: "Top Countries",
    byDevice:     "By Device",
    noData:       "No click data yet.",
    noDataHint:   "Share your link to start seeing analytics here.",
    devices: {
      mobile:  "Mobile",
      desktop: "Desktop",
      tablet:  "Tablet",
      unknown: "Other",
    },
  },

  // ─── Error messages ────────────────────────────────────────────
  errors: {
    urlRequired:  "Please enter a URL.",
    urlInvalid:   "Please enter a valid URL starting with https:// or http://",
    urlTooLong:   "URL is too long. Please use a URL under 2,000 characters.",
    slugTaken:    "This custom slug is already taken. Please try a different one.",
    slugInvalid:  "Slug can only contain letters, numbers, and hyphens.",
    slugTooShort: "Slug must be at least 3 characters.",
    slugTooLong:  "Slug cannot exceed 50 characters.",
    networkError: "Network error. Please check your connection and try again.",
    serverError:  "Something went wrong on our end. Please try again in a moment.",
    unauthorized: "You must be signed in to perform this action.",
    notFound:     "The requested link does not exist or has been deactivated.",
    rateLimited:  "You're creating links too quickly. Please wait a moment.",
    unknownError: "An unexpected error occurred. Please try again.",
  },

  // ─── Footer ────────────────────────────────────────────────────
  footer: {
    tagline:   "Fast, free URL shortening with analytics.",
    links: {
      privacy:  "Privacy Policy",
      terms:    "Terms of Service",
      contact:  "Contact",
      github:   "GitHub",
    },
    poweredBy: "Powered by",
    copyright: "All rights reserved.",
  },

  // ─── Theme & Language toggles ──────────────────────────────────
  ui: {
    toggleTheme:    "Toggle theme",
    toggleLanguage: "Switch to Spanish",
    lightMode:      "Light mode",
    darkMode:       "Dark mode",
    systemMode:     "System mode",
  },
} as const

type DeepStringRecord<T> = {
  [K in keyof T]: T[K] extends string ? string : DeepStringRecord<T[K]>
}

export type Translations = DeepStringRecord<typeof en>
