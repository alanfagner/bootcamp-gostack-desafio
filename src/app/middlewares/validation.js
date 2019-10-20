export async function isAdmin(req, res, next) {
  if (req.admin) {
    return next();
  }
  return res.status(401).json({ error: 'User does not authorized' });
}

export async function validation(req, res, next) {
  return next();
}
