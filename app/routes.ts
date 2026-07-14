import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("../src/pages/Home.jsx"),
  route("projects", "../src/pages/Projects.jsx"),
  route("projects/:id", "../src/pages/ProjectDetail.jsx"),
  route("photography", "../src/pages/Photography.jsx"),
  route("photography/:id", "../src/pages/PhotographyDetail.jsx"),
  route("services", "../src/pages/Services.jsx"),
  route("about", "../src/pages/About.jsx"),
  route("contact", "../src/pages/Contact.jsx"),
] satisfies RouteConfig;
