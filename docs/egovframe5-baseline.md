# eGovFrame 5.0 Baseline

Last verified: 2026-06-20 Asia/Seoul.

This document records the official eGovFrame 5.0 facts that Agent Estate should use when preparing workflow examples, detection rules, and public-facing language. It is a product baseline, not a compatibility claim.

## Runtime Baseline

Official runtime target:

- Runtime version: eGovFrame Runtime 5.0.0.
- Runtime release-note date: 2026-03-31.
- Java requirement from the runtime repository: JDK 17 or higher.
- Maven requirement from the runtime repository: Maven 3.6 or higher.
- Maven repository: `https://maven.egovframe.go.kr/maven/`.
- Maven coordinate pattern: `org.egovframe.rte:<artifactId>:5.0.0`.

Official release-note stack for Runtime 5.0.0:

| Area | Baseline |
| --- | --- |
| Spring Boot | 3.5.6 |
| Spring Framework | 6.2.11 |
| Spring Security | 6.5.5 |
| Spring Batch | 5.2.3 |
| Log4j | 2.25.2 |
| Hibernate | 6.6.12 |
| MyBatis | 3.5.19 |

Agent Estate implication:

- eGovFrame project detection should start from `pom.xml` metadata.
- The first strong runtime signal is `org.egovframe.rte`.
- Version-specific matching should treat `5.0.0` as the current runtime target, while leaving room for later patch updates.

## Development Baseline

Official development-environment release notes currently include:

- VS Code Extension 5.0.5 on 2026-05-19.
- Developer environment 5.0.1 on 2026-05-19.
- VS Code Extension 5.0.3 on 2026-03-31 with Project Generation, Code Generation, and Config Generation.
- VS Code Extension 5.0.3 technical stack notes: VS Code 1.84.0 or higher, TypeScript, esbuild, Vite, Node.js 20, Chromium webview, React, Handlebars, and Monaco Editor.
- Developer environment 5.0.0 on 2026-03-31 applying runtime 5.0.0 and Java 21 Eclipse packages.

The official `egovframe-vscode-initializr` repository describes the VS Code Initializr as a Visual Studio Code extension for creating and configuring eGovFrame projects.

Agent Estate implication:

- Agent Estate should treat VS Code Initializr as a related reference surface, not as a dependency.
- Future detection can look for workspace metadata created by eGovFrame project generation, but must remain read-only and secret-safe.
- Agent Estate should not claim to replace eGovFrame development environment tooling.

## Compatibility Baseline

Official compatibility confirmation is a separate paid service. The eGovFrame portal describes it as a process for checking whether commercial solutions can interoperate with eGovFrame and reports that certificate issuance generally takes about 3 to 4 weeks after application.

The portal separates compatibility confirmation software fields into:

- base software,
- linked software,
- support software such as Case Tool or ALM solutions.

Agent Estate implication:

- Agent Estate is currently a workflow and governance support tool.
- It must not claim official compatibility confirmation.
- A later compatibility-readiness effort should evaluate whether Agent Estate fits a support-software category.
- Public language should distinguish contribution recognition, official repository reference, and compatibility confirmation.

## Source Links

- Runtime release notes: https://www.egovframe.go.kr/home/sub.do?menuNo=33
- Development environment release notes: https://www.egovframe.go.kr/home/sub.do?menuNo=40
- Runtime GitHub repository: https://github.com/eGovFramework/egovframe-runtime
- VS Code Initializr GitHub repository: https://github.com/eGovFramework/egovframe-vscode-initializr
- Compatibility confirmation: https://www.egovframe.go.kr/home/sub.do?menuNo=70

## Boundaries

This baseline is for Agent Estate planning and implementation. It does not:

- certify any project,
- prove official eGovFrame compatibility,
- replace eGovFrame release notes,
- replace a project-specific security or compliance review.
