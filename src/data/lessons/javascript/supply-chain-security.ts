import type { ConceptLesson } from '../../../types/lesson'

const supplyChainSecurity: ConceptLesson = {
  // 1. Concept Summary
  slug: 'supply-chain-security',
  name: 'Supply-Chain Security',
  category: 'security',
  difficulty: 'senior',
  importance: 3,
  interviewFrequency: 2,

  // 2. Why Should I Care?
  whyCare: [
    'A modern JS app ships thousands of transitive dependencies — any one of them runs with your full privileges, so a single compromised package can own your whole build and runtime.',
    'Real incidents (event-stream, ua-parser-js, the colors/faker sabotage, malicious npm typosquats) prove this is an active, high-impact threat, not theory.',
    'Install-time scripts and CI tokens make the build pipeline itself a target — attackers steal secrets or inject backdoors before your code ever runs in production.',
    'Interviewers use it to test whether you think about the ENTIRE software supply chain (deps, lockfiles, CI, registries), not just your own code.',
    'Lockfiles, integrity hashes, and provenance are the difference between a reproducible, verifiable build and one an attacker can silently swap underneath you.',
  ],

  // 3. Child Explanation (Age 10)
  childExplanation: {
    analogy: 'Supply-chain security is checking that every ingredient in your sandwich is safe — not just the bread you bought yourself.',
    story: [
      'Imagine you make a sandwich, but the cheese came from one shop, the bread from another, and the sauce from a friend of a friend you have never met.',
      'Even if YOUR hands are clean, if any one of those ingredients was secretly spoiled, the whole sandwich can make you sick.',
      'So a careful chef checks where every ingredient came from, keeps a list of exactly which ones were used, and seals the kitchen so nobody swaps an ingredient in secret.',
      'Software is the same: your app is built from code other people wrote. Supply-chain security means checking every piece of borrowed code, writing down exactly which versions you used, and making sure nobody can sneak a bad piece in.',
    ],
  },

  // 4. School Student Explanation
  schoolExplanation: [
    'Programmers rarely write everything from scratch; they reuse libraries (packages) other people published online.',
    'Each library may itself use more libraries, so your project ends up depending on a huge tree of code you did not write.',
    'If any package in that tree is malicious or gets hacked, the bad code runs inside your app with the same powers your app has.',
    'Supply-chain security is the practice of verifying, pinning, and monitoring all those dependencies — and the tools that build and ship them — so attackers cannot poison the chain.',
  ],

  // 5. Beginner Developer Explanation
  beginnerExplanation: {
    what: 'Supply-chain security is the discipline of protecting an application from threats introduced through its dependencies and build/distribution pipeline — third-party packages, their transitive deps, install scripts, registries, CI/CD, and the artifacts you publish.',
    how: 'You pin exact versions with a lockfile, verify integrity hashes, audit for known vulnerabilities, restrict install-time scripts, scope CI permissions and secrets, and prefer signed/provenance-backed packages.',
    why: 'Installed code runs with your full privileges and your CI holds powerful secrets. Without verification, a compromised or typosquatted package can exfiltrate data, inject backdoors, or sabotage your build — entirely outside your own source code.',
    code: {
      label: 'Reproducible, verified installs in CI',
      lang: 'bash',
      code: `# Install EXACTLY what the lockfile says — fails if package.json drifts\nnpm ci\n\n# Block install-time scripts that could run arbitrary code\nnpm ci --ignore-scripts\n\n# Audit for known vulnerabilities and fail the build on highs\nnpm audit --audit-level=high`,
      explanation: [
        'npm ci installs from package-lock.json exactly, giving a reproducible tree (vs npm install which can resolve new versions).',
        '--ignore-scripts prevents postinstall/preinstall hooks — a common malware execution vector — from running.',
        'npm audit checks the resolved tree against an advisory database.',
        '--audit-level=high makes the CI step fail on serious issues instead of just warning.',
        'These three together turn installs from "trust me" into "verify and reproduce".',
      ],
    },
  },

  // 6. Technical Explanation
  technicalDefinition:
    'Software supply-chain security is the set of practices and controls that protect an application against threats introduced anywhere in the chain of components and processes used to build, distribute, and run it — direct and transitive dependencies, package registries, install-time scripts, build tooling, CI/CD systems, secrets, and published artifacts. Core mechanisms include deterministic dependency resolution via lockfiles with subresource integrity hashes, vulnerability auditing against advisory databases, minimizing and sandboxing install scripts, least-privilege CI with scoped/ephemeral credentials, dependency provenance/signing (e.g. npm provenance, Sigstore), and Software Bills of Materials (SBOMs) for traceability.',

  // 7. Internal Working
  internalWorking: [
    'When you install, the package manager resolves the dependency graph (direct + transitive) and records exact versions plus integrity hashes in a lockfile (package-lock.json / yarn.lock / pnpm-lock.yaml).',
    'On a subsequent verified install (npm ci), the manager downloads each tarball and checks its integrity hash against the lockfile, rejecting any mismatch — this is the tamper-detection layer.',
    'Packages may declare lifecycle scripts (preinstall/install/postinstall) that the manager executes with the developer\'s privileges — a deliberate execution surface attackers abuse.',
    'The resolved tree is compared against vulnerability advisory databases (npm audit / Snyk / OSV) to flag known-vulnerable versions.',
    'In CI, build steps run with secrets/tokens; a malicious dependency or script can read environment variables and network out, so least-privilege and ephemeral credentials bound the blast radius.',
    'Provenance/signing (npm provenance, Sigstore) and SBOMs let consumers verify WHERE and HOW a package was built, closing the gap between "the registry served it" and "the maintainer actually produced it".',
  ],

  // 8. Visual Mental Model
  mentalModelDiagram: `   your code  (tiny slice)
        │
        ▼  depends on
   ┌──────────────────────────────────────────┐
   │  direct deps  →  transitive deps (1000s)   │  ← any one runs as YOU
   └──────────────────────────────────────────┘
        │ install scripts          │ pulled from
        ▼                          ▼
   build/CI (holds secrets)   registry (npm)
        │                          │
   compromise here = backdoor  typosquat / hijack
        ▼
   published artifact ──► your users
   DEFENSES: lockfile+integrity · audit · --ignore-scripts ·
             least-priv CI · provenance/signing · SBOM`,

  // 10. Code Examples
  examples: {
    basic: {
      label: 'Basic — pin and verify with a lockfile',
      lang: 'bash',
      code: `# Commit the lockfile so everyone builds the SAME tree\ngit add package-lock.json\n\n# CI uses the lockfile exactly; never silently upgrades\nnpm ci\n\n# Check the integrity field exists for each package in the lock\n# (sha512 subresource integrity hashes)`,
      explanation: [
        'The lockfile records exact versions AND integrity hashes for every package, direct and transitive.',
        'Committing it makes builds reproducible and tamper-evident across machines.',
        'npm ci enforces the lockfile and fails if package.json and the lock disagree.',
        'The integrity hashes let the manager reject a tarball that was swapped after publication.',
      ],
    },
    intermediate: {
      label: 'Intermediate — block install scripts and audit in CI',
      lang: 'yaml',
      code: `# GitHub Actions step\n- name: Install (no scripts)\n  run: npm ci --ignore-scripts\n\n- name: Audit\n  run: npm audit --audit-level=high\n\n- name: Run only vetted build script\n  run: npm run build`,
      explanation: [
        '--ignore-scripts stops arbitrary postinstall code from a dependency running in CI.',
        'You then explicitly run only the build script you trust.',
        'npm audit fails the pipeline on high-severity advisories, catching known-vulnerable deps early.',
        'This separates "install packages" from "execute unknown code", a key supply-chain principle.',
      ],
    },
    advanced: {
      label: 'Advanced — least-privilege publish with provenance',
      lang: 'yaml',
      code: `# Publish from CI with provenance + scoped, short-lived token\npermissions:\n  id-token: write   # for OIDC-based provenance, no long-lived secret\n  contents: read\nsteps:\n  - run: npm ci --ignore-scripts\n  - run: npm run build\n  - run: npm publish --provenance --access public`,
      explanation: [
        'id-token: write uses OIDC so the job gets a short-lived identity instead of a static npm token that could leak.',
        'contents: read is least-privilege — the job cannot push code or escalate.',
        '--provenance attaches a signed, verifiable statement of where/how the package was built.',
        'Consumers (and the registry UI) can then verify the artifact really came from your CI, not an attacker.',
      ],
    },
    realProject: {
      label: 'Real project — dependency hygiene for a Node/Vue monorepo',
      lang: 'json',
      code: `{\n  \"scripts\": {\n    \"deps:audit\": \"npm audit --audit-level=high\",\n    \"deps:check\": \"npx depcheck && npx npm-check-updates\",\n    \"preinstall\": \"npx only-allow pnpm\"\n  },\n  \"pnpm\": {\n    \"onlyBuiltDependencies\": [\"esbuild\"]\n  }\n}`,
      explanation: [
        'pnpm.onlyBuiltDependencies allowlists which packages may run build/install scripts — everything else is blocked by default.',
        'only-allow enforces one package manager so the lockfile and resolution stay consistent across the team.',
        'Scheduled audit + depcheck catch vulnerable and unused dependencies, shrinking the attack surface.',
        'Frameworks like Vue/Next have huge dep trees, so automated hygiene plus Dependabot/Renovate PRs is standard practice.',
      ],
    },
  },

  // 11. Common Interview Questions
  interviewQuestions: [
    {
      level: 'intermediate',
      question: 'What is a software supply-chain attack?',
      answer: 'An attack that compromises your application by poisoning something you depend on — a third-party package, its transitive deps, the registry, install scripts, or your build pipeline — rather than attacking your own source code directly.',
      explanation: 'Emphasizing "not your own code" and naming the chain components is the core.',
    },
    {
      level: 'intermediate',
      question: 'Why does a lockfile improve security, not just reproducibility?',
      answer: 'It pins exact versions AND stores integrity hashes, so every install gets the same, verified tree. An attacker cannot silently bump a transitive dep to a malicious version or swap a tarball without the hash mismatch being detected.',
      explanation: 'The integrity-hash/tamper-detection angle is what elevates this beyond "reproducible builds".',
    },
    {
      level: 'advanced',
      question: 'How do install-time scripts make dependencies dangerous?',
      answer: 'Packages can declare preinstall/postinstall scripts that run with the developer\'s or CI\'s privileges the moment they are installed — before any of your code runs. Malware uses this to steal env secrets or inject backdoors. Mitigate with --ignore-scripts and allowlisting which packages may run scripts.',
      explanation: 'Recognizing install scripts as a pre-runtime execution surface is senior-leaning.',
    },
    {
      level: 'advanced',
      question: 'What is a typosquatting attack and how do you defend against it?',
      answer: 'Attackers publish malicious packages with names close to popular ones (e.g. crossenv vs cross-env) hoping for a typo. Defend with lockfiles, careful review of new deps, scoped/internal registries, and tools that flag suspicious or newly-published packages.',
      explanation: 'Naming a concrete example and layered defenses shows real awareness.',
    },
    {
      level: 'senior',
      question: 'What is dependency provenance and why does it matter?',
      answer: 'Provenance is a signed, verifiable statement of where and how a package was built (e.g. via OIDC + Sigstore, surfaced as npm provenance). It closes the gap between "the registry served this" and "the maintainer\'s trusted pipeline actually produced it", defending against account hijacks and tampering.',
      explanation: 'Connecting provenance to account-hijack/tamper threats and SLSA-style guarantees is the senior signal.',
    },
    {
      level: 'senior',
      question: 'How do you secure the CI/CD pipeline as part of the supply chain?',
      answer: 'Least-privilege, ephemeral credentials (OIDC over static tokens), scoped GITHUB_TOKEN permissions, --ignore-scripts during install, pinned action versions by SHA, isolated build runners, and SBOM generation for traceability. The build environment itself is a high-value target.',
      explanation: 'Treating the pipeline as part of the attack surface, with concrete controls, is exactly the senior framing.',
    },
  ],

  // 12. Common Follow-Up Questions
  followUps: [
    'What is the difference between npm install and npm ci?',
    'What is an SBOM and when would you generate one?',
    'How would you respond to a disclosed vulnerability in a transitive dependency you cannot upgrade?',
    'What are the risks of pinning GitHub Actions by tag instead of commit SHA?',
    'How do you reduce the size of your dependency tree?',
    'What was the event-stream incident and what did it teach the ecosystem?',
  ],

  // 13. Common Mistakes
  commonMistakes: [
    {
      mistake: 'Not committing the lockfile, or using npm install in CI.',
      why: 'Builds become non-reproducible and can silently pull in new (possibly malicious) versions, with no integrity verification.',
      fix: 'Commit the lockfile and use npm ci (or pnpm/yarn equivalents) in CI for deterministic, verified installs.',
    },
    {
      mistake: 'Letting arbitrary postinstall scripts run everywhere.',
      why: 'A compromised dep can execute code with your secrets the moment it installs.',
      fix: 'Use --ignore-scripts and allowlist only the packages that genuinely need build scripts.',
    },
    {
      mistake: 'Adding dependencies casually without review.',
      why: 'Each new package (and its tree) expands the attack surface and may be typosquatted or unmaintained.',
      fix: 'Vet new deps (downloads, maintenance, transitive size), prefer well-maintained ones, and remove unused packages.',
    },
    {
      mistake: 'Storing long-lived publish/CI tokens in plain secrets.',
      why: 'A leaked static token lets attackers publish malicious versions under your name.',
      fix: 'Use short-lived OIDC credentials, scope permissions tightly, and enable 2FA + provenance on publishing.',
    },
  ],

  // 14. Real Production Usage
  productionUsage: [
    { area: 'Node.js', detail: 'CI uses npm ci --ignore-scripts + npm audit; publishing uses OIDC provenance and 2FA; pnpm onlyBuiltDependencies allowlists install scripts.' },
    { area: 'Backend', detail: 'Internal/proxy registries (Verdaccio, Artifactory) mirror and scan packages; SBOMs (CycloneDX/SPDX) are generated per build for traceability and incident response.' },
    { area: 'React', detail: 'Renovate/Dependabot automate safe dependency PRs; lockfile + integrity hashes pin the large CRA/Next dependency tree.' },
    { area: 'Vue', detail: 'Nuxt/Vite monorepos pin tooling versions, run scheduled audits, and gate merges on a clean audit and reproducible install.' },
  ],

  // 15. Performance Impact
  performance: {
    good: [
      'npm ci is faster and more reliable than npm install in CI because it skips resolution and uses the lockfile directly.',
      'Removing unused/duplicate dependencies shrinks install time and runtime bundle size.',
    ],
    bad: [
      'Auditing, SBOM generation, and provenance verification add steps to the pipeline (seconds to minutes).',
      'Large, deep dependency trees slow installs and bloat bundles regardless of security.',
    ],
    optimizations: [
      'Cache the dependency store between CI runs while still verifying integrity hashes.',
      'Prune dependencies (depcheck) and prefer smaller, well-scoped libraries to cut both attack surface and bundle size.',
      'Run heavy scans (full audit/SBOM) on a schedule or pre-merge rather than on every commit.',
      'Use pnpm\'s content-addressable store to dedupe and speed installs across projects.',
    ],
  },

  // 16. Security Considerations
  security: {
    risks: [
      'Malicious or hijacked packages (account takeover, maintainer sabotage) running with full app privileges.',
      'Typosquatting and dependency-confusion attacks pulling attacker packages into the build.',
      'Install-script malware and compromised CI exfiltrating secrets or injecting backdoors.',
      'Long-lived publish tokens enabling unauthorized releases under a trusted name.',
    ],
    bestPractices: [
      'Commit lockfiles, use npm ci, and rely on integrity hashes for tamper detection.',
      'Disable/allowlist install scripts; audit and patch known vulnerabilities continuously.',
      'Use least-privilege, ephemeral CI credentials (OIDC), pin Actions by SHA, and enable provenance + 2FA on publish.',
      'Maintain SBOMs, use scoped/internal registries, and review every new dependency.',
    ],
  },

  // 17. Related Concepts
  related: {
    prerequisites: ['es-modules', 'commonjs', 'bundlers-module-resolution'],
    nextConcepts: ['tree-shaking', 'prototype-pollution', 'csp', 'xss'],
    dependencyNote:
      'Supply-chain security builds on understanding modules and how bundlers resolve dependencies. It connects to prototype-pollution and XSS (which often arrive via compromised deps) and to tree-shaking (smaller trees = less surface).',
  },

  // 18. Whiteboard Interview Version
  whiteboard: {
    script: [
      'Draw a tiny box "your code" feeding into a huge box "direct + transitive deps (1000s)".',
      'Note every dep runs with your privileges; mark install scripts as an execution point.',
      'Add the registry and CI/CD as separate attack targets feeding the published artifact.',
      'Mark where a compromise becomes a backdoor to your users.',
      'List defenses along the chain: lockfile+integrity, audit, --ignore-scripts, least-priv CI, provenance, SBOM.',
      'Say: "Most of your shipped code is not yours; supply-chain security verifies and pins every link from registry to runtime."',
    ],
    diagram: `  your code → [deps tree x1000] → build/CI(secrets) → registry → users
        defenses:
        lockfile+integrity | audit | --ignore-scripts
        least-priv OIDC CI | provenance/sign | SBOM`,
  },

  // 19. 30 Second Revision
  thirtySecond:
    'Most of your app is code you did not write — thousands of transitive deps that run with your privileges, plus the registry and CI that build and ship them. Supply-chain security verifies and pins every link: commit lockfiles and use npm ci for reproducible, integrity-checked installs; disable/allowlist install scripts; audit for known vulns; give CI least-privilege ephemeral credentials; and use provenance/signing and SBOMs. Real incidents (event-stream, ua-parser-js) make it concrete.',

  // 20. 2 Minute Interview Answer
  twoMinute:
    'Supply-chain security is about protecting your application from threats that arrive through everything you depend on rather than through your own code. A modern JavaScript app pulls in thousands of transitive dependencies, and every one of them runs with your full privileges, so a single compromised package can exfiltrate data or inject a backdoor. The attack surface isn\'t just packages: it includes the registry, install-time scripts, your CI/CD pipeline with its secrets, and the artifacts you publish. We\'ve seen this for real — event-stream had a malicious dependency injected, ua-parser-js was hijacked via a maintainer account, and colors/faker were sabotaged by their own author. The defenses map onto each link. First, commit a lockfile and use npm ci so installs are reproducible and verified against integrity hashes, which detects tampered tarballs. Second, disable or allowlist install scripts with --ignore-scripts, because postinstall hooks run arbitrary code before your code ever does. Third, audit continuously against advisory databases and automate upgrades with Dependabot or Renovate. Fourth, treat CI as a high-value target: use least-privilege, short-lived OIDC credentials instead of static tokens, pin GitHub Actions by commit SHA, and scope permissions. Finally, use provenance and signing — npm provenance via OIDC and Sigstore — so consumers can verify a package really came from your pipeline, and generate SBOMs for traceability during incident response. The mindset is: most of your shipped code isn\'t yours, so verify and pin every link from registry to runtime.',

  // 21. Senior Engineer Deep Dive
  seniorDeepDive: {
    tradeoffs: [
      'Pinning everything by exact version/SHA maximizes reproducibility but increases upgrade toil; automated PR bots offset it.',
      'Internal mirror/proxy registries add control and offline resilience but require operational maintenance.',
    ],
    edgeCases: [
      'Dependency confusion: a public package with the same name as an internal one can be pulled if registry scoping is misconfigured.',
      'Lockfile poisoning in PRs — a malicious contributor edits the lock to point at a bad resolved URL.',
      'Transitive vulns you cannot directly upgrade may require overrides/resolutions or vendoring.',
      'Pinning Actions by tag is mutable; tags can be repointed to malicious commits, so pin by SHA.',
    ],
    runtimeBehavior: [
      'Integrity hashes are verified at install, not at runtime, so a post-install tamper of node_modules is out of scope — protect the runtime host separately.',
      'Install scripts execute synchronously during install with full environment access, including CI secrets.',
      'Provenance verification happens at install/publish time and relies on transparency logs being available.',
    ],
    scalability: [
      'In large monorepos, content-addressable stores (pnpm) and shared caches keep installs fast while preserving verification.',
      'Centralized policy (allowed registries, audit gates, SBOM generation) scales better than per-repo configuration.',
    ],
    productionConcerns: [
      'Maintain an incident plan: when a dep CVE drops, SBOMs let you find affected services fast.',
      'Rotate and scope publish tokens; enable 2FA and provenance to prevent unauthorized releases.',
      'Monitor for newly-added or unexpectedly-updated transitive deps as a tamper signal.',
    ],
  },

  // 22. Cheat Sheet
  cheatSheet: [
    'Most shipped code is third-party; deps run with your privileges.',
    'Attack surface: deps, transitive deps, install scripts, registry, CI, artifacts.',
    'Commit lockfiles; use npm ci for reproducible, integrity-verified installs.',
    'Integrity hashes detect tampered tarballs.',
    '--ignore-scripts blocks postinstall malware; allowlist scripts where needed.',
    'Audit continuously (npm audit / Snyk / OSV); automate with Dependabot/Renovate.',
    'CI is a target: least-privilege, OIDC ephemeral creds, pin Actions by SHA.',
    'Provenance + signing (npm provenance / Sigstore) verify build origin.',
    'Generate SBOMs (CycloneDX/SPDX) for traceability.',
    'Beware typosquatting and dependency confusion.',
    'Vet and prune dependencies to shrink attack surface.',
    'Real incidents: event-stream, ua-parser-js, colors/faker.',
  ],

  // 23. Coding Exercises
  exercises: [
    {
      difficulty: 'easy',
      prompt: 'Write the CI commands to install dependencies reproducibly without running install scripts, then fail on high-severity vulnerabilities.',
      hint: 'npm ci + flags, then npm audit.',
      solution: {
        lang: 'bash',
        code: `npm ci --ignore-scripts\nnpm audit --audit-level=high`,
        explanation: [
          'npm ci installs exactly from the lockfile and verifies integrity hashes.',
          '--ignore-scripts blocks arbitrary install-time code execution.',
          '--audit-level=high makes the pipeline fail on serious advisories rather than just warn.',
        ],
      },
    },
    {
      difficulty: 'medium',
      prompt: 'Write a package.json snippet (pnpm) that enforces a single package manager and allowlists which deps may run build scripts.',
      hint: 'Use preinstall only-allow and pnpm.onlyBuiltDependencies.',
      solution: {
        lang: 'json',
        code: `{\n  \"scripts\": { \"preinstall\": \"npx only-allow pnpm\" },\n  \"pnpm\": {\n    \"onlyBuiltDependencies\": [\"esbuild\", \"sharp\"]\n  }\n}`,
        explanation: [
          'only-allow blocks installs with the wrong package manager, keeping the lockfile consistent.',
          'onlyBuiltDependencies makes pnpm run build scripts ONLY for the listed trusted packages.',
          'Every other dependency is installed without executing its scripts, shrinking the execution surface.',
        ],
      },
    },
    {
      difficulty: 'hard',
      prompt: 'Write a GitHub Actions publish job that uses OIDC (no static token), pins the checkout action by SHA, and publishes with provenance.',
      hint: 'Set permissions.id-token: write and use --provenance.',
      solution: {
        lang: 'yaml',
        code: `jobs:\n  publish:\n    permissions:\n      id-token: write\n      contents: read\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@<commit-sha>\n      - uses: actions/setup-node@<commit-sha>\n        with: { node-version: 20, registry-url: 'https://registry.npmjs.org' }\n      - run: npm ci --ignore-scripts\n      - run: npm run build\n      - run: npm publish --provenance --access public`,
        explanation: [
          'id-token: write enables OIDC so no long-lived npm token is stored as a secret.',
          'Pinning actions by commit SHA prevents a repointed tag from injecting malicious steps.',
          '--provenance attaches a verifiable build attestation to the published package.',
          'contents: read keeps the job least-privilege.',
        ],
      },
    },
    {
      difficulty: 'interview',
      prompt: 'A disclosed RCE exists in a transitive dependency three levels deep that your direct dep has not yet patched. Describe and implement a mitigation.',
      hint: 'Use npm overrides / pnpm overrides to force a safe version.',
      solution: {
        lang: 'json',
        code: `{\n  \"overrides\": {\n    \"vulnerable-pkg\": \"1.2.4\"\n  }\n}\n\n// pnpm equivalent:\n// \"pnpm\": { \"overrides\": { \"vulnerable-pkg@<1.2.4\": \"1.2.4\" } }\n\n// Steps: 1) confirm 1.2.4 is compatible, 2) add override, 3) npm ci,\n//        4) npm audit to verify it's resolved, 5) add a test, 6) track upstream fix.`,
        explanation: [
          'overrides force the entire tree to resolve the vulnerable package to a patched version even when a parent has not updated.',
          'You verify compatibility and re-run audit to confirm the advisory clears.',
          'It is a stopgap — you still track and remove the override once the direct dep ships its own fix.',
        ],
      },
    },
  ],

  // 24. Confidence Booster
  confidenceBooster: {
    whyImportant:
      'Supply-chain security shows you reason about the whole system, not just your code — recognizing that thousands of third-party lines run with your privileges and that the build pipeline itself is a target. That systems-level thinking is exactly what senior and staff interviews look for.',
    howCompaniesAsk:
      'Service companies (TCS, Infosys, Cognizant) ask the definition and "what does a lockfile do". Product companies (Zoho, Flipkart, Razorpay) ask about install scripts, auditing, and CI secrets. FAANG-level interviews probe provenance/SLSA, dependency confusion, SBOMs, and incident response.',
    whatInterviewersExpect:
      'They expect you to define the threat as anything outside your own code, name the chain components, and give concrete defenses per link: lockfiles + integrity, --ignore-scripts, auditing, least-privilege CI with OIDC, provenance/signing, and SBOMs — ideally citing a real incident.',
  },
}

export default supplyChainSecurity
