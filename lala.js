const mongoose = require("mongoose");

// Define the Product schema
const productSchema = new mongoose.Schema({
  category: String,
  title: String,
  brand: String,
  price: Number,
  photo: String,
  subcategory1: String,
  subcategory2: String,
  availability: String,
  description: String,
});

// Define the Pharmacy schema
const pharmacySchema = new mongoose.Schema({
  name: String,
  location: String,
  inventory: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      category: String,
      title: String,
      brand: String,
      price: Number,
      photo: String,
      quantity: Number,
    },
  ],
});

// Create separate connections
const dbProduct = mongoose.createConnection(
  "mongodb+srv://roxanamihoc67:Roxana123@cluster0.85fbtf2.mongodb.net/Products?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const dbPharmacy = mongoose.createConnection(
  "mongodb+srv://roxanamihoc67:Roxana123@cluster0.85fbtf2.mongodb.net/Pharmacy?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

// Create models
const Product = dbProduct.model("Products", productSchema, "products");
const Pharmacy = dbPharmacy.model("Pharmacy", pharmacySchema, "pharmacy");

async function updatePharmacyInventory() {
  try {
    // Fetch all products
    const products = await Product.find({});

    // Generate random inventory from products
    const inventory = products
      .map((product) => {
        return {
          category: product.category,
          title: product.title,
          brand: product.brand,
          price: product.price,
          photo: product.photo,
          productId: product._id,
          quantity: Math.floor(Math.random() * 100) + 1, // Random quantity between 1 and 100
        };
      })
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * products.length)); // Select a random number of products

    // Update or insert a pharmacy document
    const pharmacyUpdate = await Pharmacy.findOneAndUpdate(
      { name: "Farmacia Centrală" }, // Specify the pharmacy name
      {
        $set: {
          location: "Strada Racului nr 17", // Specify the location
          inventory: inventory,
        },
      },
      { new: true, upsert: true } // Upsert option creates the document if it doesn't exist
    );

    console.log("Pharmacy inventory updated:", pharmacyUpdate);
  } catch (error) {
    console.error("Failed to update pharmacy inventory:", error);
  }
}

updatePharmacyInventory().then(() => {
  dbProduct.close();
  dbPharmacy.close();
});

// Table Users {
//   _id ObjectId [pk]
//   firstName String
//   lastName String
//   email String
//   password String
//   identifier String
//   role String
//   cart Array
//   orders Array
//   doctor ObjectId
//   gender String
//   phone String
//   address String
//   city String
//   birth_date Date
//   postal_code String
// }

// Table Doctors {
//   _id ObjectId [pk]
//   firstName String
//   lastName String
//   email String
//   password String
//   identifier String
//   role String
//   patients ObjectId[] [ref: > Users._id]
// }

// Table Pharmacists {
//   _id ObjectId [pk] // ID-ul unic al fiecărui farmacist
//   firstName String // Prenumele farmacistului
//   lastName String // Numele de familie al farmacistului
//   email String // Email-ul farmacistului
//   password String // Parola farmacistului, stocată ca un hash
//   identifier String // Un identificator unic, cum ar fi un cod de licență
//   role String 
//   patients Array // O listă de pacienți asociați, dacă este cazul
// }

// Table Pharmacy {
//   _id ObjectId [pk]
//   name String
//   location String
//   photo String
//   email String
//   pharmacistId ObjectId [ref: > Pharmacists._id]
//   inventory Array
// }

// Table Orders {
//   _id ObjectId [pk]
//   firstName String
//   lastName String
//   phone String
//   email String
//   address String
//   county String
//   city String
//   totalPrice Float
//   user ObjectId [ref: > Users._id]
//   status String
//   pharmacist ObjectId [ref: > Pharmacists._id]
//   orderNumber String
//   cart Array
//   date DateTime
// }

// Table Products {
//   _id ObjectId [pk]
//   category String
//   subcategory1 String
//   subcategory2 String
//   title String
//   brand String
//   price Float
//   availability String
//   description String
//   photo String
//   insurance String
// }

// Table Prescriptions {
//   _id ObjectId [pk]
//   prescriptionNumber String
//   doctorId ObjectId [ref: > Doctors._id]
//   patientId ObjectId [ref: > Users._id]
//   diagnosis String
//   products Array 
//   notes String
//   status String
//   date DateTime
// }
