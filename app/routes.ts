import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("../src/pages/Home.jsx"),
  route("projects", "../src/pages/Projects.jsx"),
  route("projects/:id", "../src/pages/ProjectDetail.jsx"),
  route("services", "../src/pages/Services.jsx"),
  route("about", "../src/pages/About.jsx"),
  route("contact", "../src/pages/Contact.jsx"),
  route("internship", "../src/pages/Internship.jsx"),
] satisfies RouteConfig;
