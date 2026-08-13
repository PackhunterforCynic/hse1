import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("../src/pages/Home.jsx"),
  route("projects", "../src/pages/Projects.jsx"),
  route("projects/:id", "../src/pages/ProjectDetail.jsx"),
  route("services", "../src/pages/Services.jsx"),
  route("about", "../src/pages/About.jsx"),
  route("contact", "../src/pages/Contact.jsx"),
  route("internship", "../src/pages/Internship.jsx"),
  route("submit-testimonial", "../src/pages/SubmitTestimonial.jsx"),
  
  // Admin Routes
  route("admin/login", "../src/pages/admin/Login.jsx"),
  route("admin", "../src/pages/admin/AdminLayout.jsx", [
    index("../src/pages/admin/Dashboard.jsx"),
    route("services", "../src/pages/admin/Services.jsx"),
    route("contacts", "../src/pages/admin/Contacts.jsx"),
    route("internships", "../src/pages/admin/Internships.jsx"),
    route("testimonials", "../src/pages/admin/Testimonials.jsx"),
    route("settings", "../src/pages/admin/Settings.jsx"),
  ]),

  // Catch-all 404 Route
  route("*", "../src/pages/NotFound.jsx"),
] satisfies RouteConfig;
