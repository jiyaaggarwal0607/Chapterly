const router = require('express').Router();
const auth = require('../middleware/auth');
const requireRole = require('../middleware/role');
const User = require('../models/User');
const TranslationProject = require('../models/TranslationProject');
const Application = require('../models/Application');
const TranslatorProfile = require('../models/TranslatorProfile');
const { wrap, like, exact } = require('../utils');

// ---------- Projects (opportunities) ----------

// GET /api/translation/projects?search=&language=&task=   (public)
router.get('/projects', wrap(async (req, res) => {
  const { search, language, task } = req.query;
  const filter = {};
  const and = [];
  if (search) and.push({ $or: [{ title: like(search) }, { description: like(search) }] });
  if (language && language !== 'all')
    and.push({ $or: [{ fromLanguage: exact(language) }, { toLanguage: exact(language) }] });
  if (task && task !== 'all') filter.taskType = exact(task);
  if (and.length) filter.$and = and;
  res.json(await TranslationProject.find(filter).sort({ createdAt: -1 }));
}));

router.get('/projects/:id', wrap(async (req, res) => {
  const project = await TranslationProject.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
}));

// Company account new project post kar sakta hai
router.post('/projects', auth, requireRole('company'), wrap(async (req, res) => {
  const project = await TranslationProject.create({ ...req.body, postedBy: req.user._id });
  res.status(201).json(project);
}));

// ---------- Translator profile ----------

router.get('/profile', auth, wrap(async (req, res) => {
  const profile = await TranslatorProfile.findOne({ user: req.user._id });
  res.json(profile || {});
}));

router.put('/profile', auth, wrap(async (req, res) => {
  const { languagePairs, experienceLevel, bio, portfolioLink } = req.body;
  const profile = await TranslatorProfile.findOneAndUpdate(
    { user: req.user._id },
    { languagePairs, experienceLevel, bio, portfolioLink },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.json(profile);
}));

// ---------- Applications ----------

// Apply form: body { projectId, fullName, email, languagePair, experienceLevel, portfolioLink, whyJoin }
router.post('/applications', auth, wrap(async (req, res) => {
  const { projectId, fullName, email, languagePair, experienceLevel, portfolioLink, whyJoin } = req.body;
  if (!projectId || !fullName || !email)
    return res.status(400).json({ message: 'projectId, fullName and email are required' });

  const project = await TranslationProject.findById(projectId);
  if (!project) return res.status(404).json({ message: 'Project not found' });

  const already = await Application.findOne({ user: req.user._id, project: projectId });
  if (already) return res.status(400).json({ message: 'You already applied to this project' });

  const application = await Application.create({
    user: req.user._id,
    project: projectId,
    fullName,
    email,
    languagePair,
    experienceLevel,
    portfolioLink,
    whyJoin,
  });
  await User.findByIdAndUpdate(req.user._id, { isTranslator: true });
  res.status(201).json(application);
}));

// Reader: meri applications. Company: sabki applications.
router.get('/applications', auth, wrap(async (req, res) => {
  const filter = req.user.role === 'company' ? {} : { user: req.user._id };
  res.json(await Application.find(filter).populate('project').sort({ createdAt: -1 }));
}));

// Ongoing = jo applications accept ho gayi
router.get('/ongoing', auth, wrap(async (req, res) => {
  const list = await Application.find({ user: req.user._id, status: 'accepted' }).populate('project');
  res.json(list);
}));

// Company accept / reject karta hai: body { status: 'accepted' | 'rejected' }
router.put('/applications/:id/status', auth, requireRole('company'), wrap(async (req, res) => {
  const { status } = req.body;
  if (!['pending', 'accepted', 'rejected'].includes(status))
    return res.status(400).json({ message: 'Invalid status' });
  const application = await Application.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!application) return res.status(404).json({ message: 'Application not found' });
  res.json(application);
}));

module.exports = router;