import mongoose from "mongoose";

const garageSchema = new mongoose.Schema(
{
  
  name: {
    type: String,
    required: true,
    trim: true
  },

  ownerName: {
    type: String,
    required: true,
    trim: true
  },

  phone: {
    type: String,
    required: true
  },

  email: {
    type: String,
    lowercase: true,
    trim: true,
    unique: true
  },

  password: {
    type: String
  },

  //  Garage Details
  address: {
    type: String,
    required: true
  },

  city: {
    type: String
  },

  description: {
    type: String
  },

  location: {
    type: {
      type: String,
      enum: ["Point"],
      default: "Point"
    },
    coordinates: {
      type: [Number] // lat, long
    }
  },

  logo: {
    type: String
  },

  shopImages: [
    {
      type: String
    }
  ],


  services: [
    {
      type: String
    }
  ],

 
  openingTime: String,
  closingTime: String,

  isOpen24Hours: {
    type: Boolean,
    default: false
  },

  
documents: {
  registrationCertificate: String,
  citizenshipFront: String,
  citizenshipBack: String,
  panNumber: String,
  vatNumber: String
},

  paymentDetails: {
    bankName: String,
    accountHolderName: String,
    accountNumber: String,
    branch: String,

   
    esewaId: String,
    khaltiId: String
  },


  rating: {
    type: Number,
    default: 0
  },

  totalReviews: {
    type: Number,
    default: 0
  },


  status: {
    type: String,
    enum: ["pending", "approved", "rejected"],
    default: "pending"
  },

  isVerified: {
    type: Boolean,
    default: false
  }

},
{ timestamps: true }
);

const Garage = mongoose.model("Garage", garageSchema);

export default Garage;