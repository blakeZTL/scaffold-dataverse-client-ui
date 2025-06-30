#!/usr/bin/env node

import inquirer from "inquirer";
import { join } from "path";
import fs from "fs-extra";
import { execa } from "execa";
import chalk from "chalk";

// Package manager detection
type PackageManager = "npm" | "yarn" | "pnpm";

async function detectPackageManagers(): Promise<PackageManager[]> {
  const managers: PackageManager[] = [];

  try {
    await execa("npm", ["--version"]);
    managers.push("npm");
  } catch {}

  try {
    await execa("yarn", ["--version"]);
    managers.push("yarn");
  } catch {}

  try {
    await execa("pnpm", ["--version"]);
    managers.push("pnpm");
  } catch {}

  return managers;
}

function getPackageManagerCommands(manager: PackageManager) {
  switch (manager) {
    case "npm":
      return {
        install: ["npm", "install"],
        run: "npm run",
        dev: "npm run dev",
        build: "npm run build",
      };
    case "yarn":
      return {
        install: ["yarn", "install"],
        run: "yarn",
        dev: "yarn dev",
        build: "yarn build",
      };
    case "pnpm":
      return {
        install: ["pnpm", "install"],
        run: "pnpm run",
        dev: "pnpm run dev",
        build: "pnpm run build",
      };
  }
}

async function main() {
  console.log(chalk.cyan("🚀 Dataverse Web Resource Project Initializer"));

  // Detect available package managers
  const availableManagers = await detectPackageManagers();

  if (availableManagers.length === 0) {
    console.error(
      chalk.red(
        "❌ No package manager found. Please install npm, yarn, or pnpm."
      )
    );
    process.exit(1);
  }

  const prompts: any[] = [
    {
      name: "projectName",
      message: "Project name:",
      type: "input",
      default: "dataverse-client-ui",
      validate: (input: string) => {
        if (!input.trim()) {
          return "Project name cannot be empty";
        }
        if (!/^[a-z0-9-]+$/.test(input)) {
          return "Project name should contain only lowercase letters, numbers, and hyphens";
        }
        return true;
      },
    },
  ];

  // Add package manager selection if multiple are available
  if (availableManagers.length > 1) {
    prompts.push({
      name: "packageManager",
      message: "Which package manager would you like to use?",
      type: "list",
      choices: availableManagers.map((manager) => ({
        name: `${manager} ${manager === "pnpm" ? "(recommended)" : ""}`,
        value: manager,
      })),
      default: availableManagers.includes("pnpm")
        ? "pnpm"
        : availableManagers[0],
    });
  }

  const answers = await inquirer.prompt(prompts);
  const { projectName } = answers;
  const packageManager: PackageManager =
    answers.packageManager || availableManagers[0];
  const pmCommands = getPackageManagerCommands(packageManager);

  const targetDir = join(process.cwd(), projectName);

  // Check if directory already exists
  if (await fs.pathExists(targetDir)) {
    const { overwrite } = await inquirer.prompt([
      {
        name: "overwrite",
        message: `Directory "${projectName}" already exists. Overwrite?`,
        type: "confirm",
        default: false,
      },
    ]);

    if (!overwrite) {
      console.log(chalk.yellow("Operation cancelled"));
      return;
    }

    await fs.remove(targetDir);
  }

  console.log(chalk.blue("📁 Creating project directory..."));
  await fs.ensureDir(targetDir);
  await fs.copy(join(__dirname, "..", "template"), targetDir);

  // Update package.json with the actual project name
  const packageJsonPath = join(targetDir, "package.json");
  const packageJson = await fs.readJson(packageJsonPath);
  packageJson.name = projectName;
  await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

  // Update README.md with the actual project name and package manager commands
  const readmePath = join(targetDir, "README.md");
  let readmeContent = await fs.readFile(readmePath, "utf8");
  readmeContent = readmeContent.replace(/{{PROJECT_NAME}}/g, projectName);
  readmeContent = readmeContent.replace(
    /{{PACKAGE_MANAGER_INSTALL}}/g,
    pmCommands.install.join(" ")
  );
  readmeContent = readmeContent.replace(
    /{{PACKAGE_MANAGER_BUILD}}/g,
    pmCommands.build
  );
  readmeContent = readmeContent.replace(
    /{{PACKAGE_MANAGER_RUN}}/g,
    pmCommands.run
  );
  await fs.writeFile(readmePath, readmeContent);

  console.log(
    chalk.blue(`📦 Installing dependencies with ${packageManager}...`)
  );
  await execa(pmCommands.install[0], pmCommands.install.slice(1), {
    cwd: targetDir,
    stdio: "inherit",
  });

  console.log(chalk.green("✅ Project created successfully!"));
  console.log(chalk.cyan(`\nNext steps:`));
  console.log(chalk.white(`  cd ${projectName}`));
  console.log(chalk.white(`  ${pmCommands.build}`));
}

main().catch((error) => {
  console.error(chalk.red("❌ Error:"), error.message);
  process.exit(1);
});
