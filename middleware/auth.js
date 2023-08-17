
// user authentication
export const auth = (req,res,next) =>{
    if(req.session && req.session.isLoggedIn){
      next();
    }else{
    // Return a 401 Unauthorized status code and error message if the user is not logged in
    res.status(401).json({ message: 'Unauthorized' });
    }
}
