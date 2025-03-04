// ... existing code ...

const verifyGitOrigin = (req, res, next) => {
    const event = req.body;
    
    if (!verify(event)) {
        return res.status(403).json({ error: 'Invalid repository origin' });
    }
    
    next();
};

function verify(event) {
    if (!event || !event.repository) return false;
    return event?.repository?.id === 454284151; // this is shallow security check for making sure it is from github. Requires signature verify
}

module.exports = verifyGitOrigin;