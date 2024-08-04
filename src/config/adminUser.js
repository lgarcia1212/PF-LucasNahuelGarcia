export const adminUser = (req, res, next) => {
    if (req.session.user && req.session.user.rol === 'Admin') {
      next();
    } else {
      res.status(403).send("No cuenta con permisos de administrador.");
    }
  };
  