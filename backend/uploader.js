var express  =  require( 'express' );
var cors     =  require( 'cors' );
var multer   =  require( 'multer' );
var upload   =  multer( { dest: 'uploads/' } );
var sizeOf   =  require( 'image-size' );
require( 'string.prototype.startswith' );

// CREATE EXPRESS INSTANCE
var app = express();

// CORS
var whitelist = [
  'http://localhost:3000',
  'http://nmh-admin.surge.sh'
];
var corsOptions = {
  origin: function(origin, callback){
    console.log(origin)
    var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, originIsWhitelisted);
  },
  credentials: true
};
app.use(cors(corsOptions));

app.use( express.static( __dirname + '/bower_components' ) );

app.post( '/upload', upload.single( 'file' ), function( req, res, next ) {
  console.log(req)
  if ( !req.file.mimetype.startsWith( 'image/' ) ) {
    return res.status( 422 ).json( {
      error : 'The uploaded file must be an image'
    } );
  }

  var dimensions = sizeOf( req.file.path );

  if ( ( dimensions.width < 640 ) || ( dimensions.height < 480 ) ) {
    return res.status( 422 ).json( {
      error : 'The image must be at least 640 x 480px'
    } );
  }

  return res.status( 200 ).send( req.file );
});

app.listen( 8080, function() {
  console.log( 'Express server listening on port 8080' );
});
