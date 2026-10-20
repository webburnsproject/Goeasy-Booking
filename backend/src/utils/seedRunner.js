require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Vehicle = require('../models/Vehicle');
const Booking = require('../models/Booking');

const seedDatabase = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    console.log('[Seeder]: Connecting to MongoDB Atlas...');
    if (mongoose.connection.readyState === 0 && uri) {
      await mongoose.connect(uri);
    }
    console.log('[Seeder]: Connected to MongoDB!');

    console.log('[Seeder]: Cleaning existing test records...');
    await User.deleteMany({});
    await Vehicle.deleteMany({});
    await Booking.deleteMany({});

    console.log('[Seeder]: Creating Super Admin...');
    const admin = await User.create({
      name: 'Super Admin GoEasy',
      email: 'admin@goeasy.com',
      phone: '+91 98765 00001',
      password: 'Admin@12345',
      role: 'admin',
      status: 'active',
      policyAccepted: true,
      city: 'Delhi NCR',
    });

    console.log('[Seeder]: Creating Vehicle Owners...');
    // Owner 1: Approved & Active
    const owner1 = await User.create({
      name: 'Rajesh Sharma',
      email: 'sharma.travels@goeasy.com',
      phone: '+91 98112 34567',
      password: 'Owner@12345',
      role: 'owner',
      status: 'active',
      policyAccepted: true,
      city: 'Delhi NCR',
      ownerProfile: {
        agencyName: 'Sharma InterCity Travels',
        operatingBaseCity: 'Delhi NCR',
        initialVehicleType: 'SUV',
        initialSeater: 7,
        sampleVehicleImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
        kycDocuments: {
          aadhaarNumber: 'XXXX-XXXX-8921',
          aadhaarDoc: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
          panNumber: 'ABCPS8921F',
          panDoc: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
          submittedAt: new Date(Date.now() - 7 * 86400000),
          verifiedAt: new Date(Date.now() - 5 * 86400000),
        },
      },
    });

    // Owner 2: Approved & Active (South India)
    const owner2 = await User.create({
      name: 'Venkatesh Rao',
      email: 'venkat.tours@goeasy.com',
      phone: '+91 94481 23456',
      password: 'Owner@12345',
      role: 'owner',
      status: 'active',
      policyAccepted: true,
      city: 'Bengaluru',
      ownerProfile: {
        agencyName: 'Venkateshwara Coastal Tours',
        operatingBaseCity: 'Bengaluru',
        initialVehicleType: 'Tempo Traveller',
        initialSeater: 12,
        sampleVehicleImage: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800',
        kycDocuments: {
          aadhaarNumber: 'XXXX-XXXX-4432',
          aadhaarDoc: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
          panNumber: 'BKRVR4432M',
          panDoc: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
          submittedAt: new Date(Date.now() - 10 * 86400000),
          verifiedAt: new Date(Date.now() - 8 * 86400000),
        },
      },
    });

    // Owner 3: Pending KYC Verification (Admin inspects documents)
    const owner3 = await User.create({
      name: 'Vikram Rathore',
      email: 'vikram.rentals@goeasy.com',
      phone: '+91 97841 55667',
      password: 'Owner@12345',
      role: 'owner',
      status: 'pending_final_approval',
      policyAccepted: true,
      city: 'Jaipur',
      ownerProfile: {
        agencyName: 'Royal Rajputana Rentals',
        operatingBaseCity: 'Jaipur',
        initialVehicleType: 'SUV',
        initialSeater: 7,
        sampleVehicleImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
        kycDocuments: {
          aadhaarNumber: 'XXXX-XXXX-9102',
          aadhaarDoc: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
          panNumber: 'CHJVR9102K',
          panDoc: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
          submittedAt: new Date(Date.now() - 1 * 86400000),
        },
      },
    });

    // Owner 4: Pending Initial Approval (Admin initial review)
    const owner4 = await User.create({
      name: 'Sunil Fernandes',
      email: 'sunil.goa@goeasy.com',
      phone: '+91 98221 88990',
      password: 'Owner@12345',
      role: 'owner',
      status: 'pending_initial_approval',
      policyAccepted: true,
      city: 'Goa',
      ownerProfile: {
        agencyName: 'Goa Coastal Cabs & SelfDrive',
        operatingBaseCity: 'Goa',
        initialVehicleType: 'Sedan',
        initialSeater: 5,
        sampleVehicleImage: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
      },
    });

    console.log('[Seeder]: Creating Customer Users...');
    const user1 = await User.create({
      name: 'Rohan Mehta',
      email: 'user@goeasy.com',
      phone: '+91 98200 11223',
      password: 'User@12345',
      role: 'user',
      status: 'active',
      policyAccepted: true,
      city: 'Mumbai',
    });

    const user2 = await User.create({
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      phone: '+91 99100 44556',
      password: 'User@12345',
      role: 'user',
      status: 'active',
      policyAccepted: true,
      city: 'Delhi NCR',
    });

    console.log('[Seeder]: Creating Approved & Inspected Vehicles...');
    const v1 = await Vehicle.create({
      owner: owner1._id,
      name: 'Toyota Innova Crysta 2.4 VX',
      brand: 'Toyota',
      model: 'Innova Crysta 2.4 VX (Captain Seats)',
      registrationNumber: 'DL 01 AA 1024',
      type: 'MUV',
      seatingCapacity: 7,
      fuelType: 'Diesel',
      transmission: 'Manual',
      dailyRate: 3800,
      perKmRate: 17,
      features: ['Air Conditioning', 'Captain Pushback Seats', 'Fastag', 'Rear AC Vents', 'Bluetooth Audio', 'Roof Luggage Carrier'],
      servicedCities: ['Delhi', 'Jaipur', 'Agra', 'Chandigarh', 'Noida', 'Gurugram'],
      description: 'The undisputed king of Indian highway travel. Plush captain seats, whisper-quiet cabin, top-grade safety, and verified clean upholstery.',
      documents: {
        rcDocument: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        insurancePolicy: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800',
        pucCertificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
        rentalPermit: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
        fitnessCertificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
      },
      conditionReport: {
        photos: {
          front: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
          rear: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
          left: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
          right: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
          interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800',
          dashboard: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
          odometer: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
          numberPlate: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
        },
        odometerReading: 32450,
        existingDamageNotes: 'Mint condition, verified showroom serviced. Micro swirl mark on rear bumper corner.',
      },
      status: 'approved',
      isAllocated: true, // Booked on Booking 1 (DL 01 AA 1024)
      isAvailable: true,
      rating: 4.95,
      totalTrips: 42,
    });

    const v2 = await Vehicle.create({
      owner: owner1._id,
      name: 'Maruti Suzuki Ertiga ZXi+ Hybrid',
      brand: 'Maruti Suzuki',
      model: 'Ertiga ZXi Plus Smart Hybrid',
      registrationNumber: 'DL 03 BC 4589',
      type: 'MUV',
      seatingCapacity: 7,
      fuelType: 'CNG',
      transmission: 'Manual',
      dailyRate: 2800,
      perKmRate: 14,
      features: ['Dual AC', 'Comfort Reclining Seats', 'Fastag', 'Apple CarPlay', 'High Mileage Economy'],
      servicedCities: ['Delhi', 'Jaipur', 'Agra', 'Haridwar', 'Dehradun'],
      description: 'Super economical 7-seater MUV, ideal for family trips and weekend getaways across North India.',
      documents: {
        rcDocument: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        insurancePolicy: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800',
        pucCertificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
      },
      conditionReport: {
        photos: {
          front: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
          rear: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
          left: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
          right: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
          interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800',
          dashboard: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
          odometer: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
          numberPlate: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
        },
        odometerReading: 21800,
        existingDamageNotes: 'Clean interior, spotless body panels, freshly detailed.',
      },
      status: 'approved',
      isAllocated: true, // Booked on Booking 2 (DL 03 BC 4589)
      isAvailable: true,
      rating: 4.88,
      totalTrips: 28,
    });

    const v3 = await Vehicle.create({
      owner: owner2._id,
      name: 'Mahindra XUV700 AX7 Luxury',
      brand: 'Mahindra',
      model: 'XUV700 AX7 AWD Diesel',
      registrationNumber: 'KA 05 MN 9921',
      type: 'SUV',
      seatingCapacity: 7,
      fuelType: 'Diesel',
      transmission: 'Automatic',
      dailyRate: 4600,
      perKmRate: 19,
      features: ['Panoramic Skyroof', 'Sony 12-Speaker 3D Audio', 'ADAS Safety', 'Wireless Charger', 'Leatherette Seats'],
      servicedCities: ['Bengaluru', 'Mysore', 'Coorg', 'Ooty', 'Hyderabad'],
      description: 'Ultra-luxurious flagship SUV with panoramic roof, high-power turbo diesel engine, and supreme comfort.',
      documents: {
        rcDocument: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        insurancePolicy: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800',
      },
      conditionReport: {
        photos: {
          front: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
          rear: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
          left: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
          right: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
          interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800',
          dashboard: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
          odometer: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
          numberPlate: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
        },
        odometerReading: 15400,
        existingDamageNotes: 'Pristine condition, corporate maintained vehicle.',
      },
      status: 'approved',
      isAllocated: false,
      isAvailable: true,
      rating: 4.97,
      totalTrips: 36,
    });

    const v4 = await Vehicle.create({
      owner: owner2._id,
      name: 'Force Urbania Luxury Van',
      brand: 'Force Motors',
      model: 'Urbania Medium Wheelbase 17-Seater',
      registrationNumber: 'KA 01 TR 7700',
      type: 'Tempo Traveller',
      seatingCapacity: 17,
      fuelType: 'Diesel',
      transmission: 'Manual',
      dailyRate: 7500,
      perKmRate: 26,
      features: ['Individual AC Vents', 'Individual USB Ports', 'Executive Pushback Recliners', 'Ambient Mood Lighting', 'Air Suspension'],
      servicedCities: ['Bengaluru', 'Mysore', 'Coorg', 'Goa', 'Chennai', 'Hyderabad'],
      description: 'International benchmark European design passenger van. Ultimate luxury for corporate tours, family pilgrimages, and group travels.',
      documents: {
        rcDocument: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        insurancePolicy: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800',
        rentalPermit: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
      },
      conditionReport: {
        photos: {
          front: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800',
          rear: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
          left: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
          right: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
          interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800',
          dashboard: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
          odometer: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
          numberPlate: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
        },
        odometerReading: 12100,
        existingDamageNotes: 'Factory condition, zero damages, non-smoking cabin.',
      },
      status: 'approved',
      isAllocated: false,
      isAvailable: true,
      rating: 4.99,
      totalTrips: 19,
    });

    const v5 = await Vehicle.create({
      owner: owner1._id,
      name: 'Force Tempo Traveller 3350 AC',
      brand: 'Force Motors',
      model: 'Traveller 3350 Super Luxury',
      registrationNumber: 'DL 01 TT 2026',
      type: 'Tempo Traveller',
      seatingCapacity: 12,
      fuelType: 'Diesel',
      transmission: 'Manual',
      dailyRate: 5400,
      perKmRate: 22,
      features: ['Chilled AC', 'Pushback 2x1 Recliners', 'Flat Screen LED TV', 'Fastag', 'Spacious Boot'],
      servicedCities: ['Delhi', 'Manali', 'Shimla', 'Jaipur', 'Agra', 'Rishikesh'],
      description: 'Ideal hill station and group tour vehicle with high ground clearance and mountain-tested performance.',
      documents: {
        rcDocument: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        insurancePolicy: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800',
      },
      conditionReport: {
        photos: {
          front: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800',
          rear: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
          left: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
          right: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
          interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800',
          dashboard: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
          odometer: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
          numberPlate: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
        },
        odometerReading: 48900,
        existingDamageNotes: 'Well maintained, tyres in excellent condition.',
      },
      status: 'approved',
      isAllocated: false,
      isAvailable: true,
      rating: 4.86,
      totalTrips: 51,
    });

    // Vehicle 6: Pending Admin Approval (to test Admin vehicle verification!)
    const vPending = await Vehicle.create({
      owner: owner1._id,
      name: 'Toyota Fortuner 4x4 Legender',
      brand: 'Toyota',
      model: 'Fortuner 2.8 4x4 AT',
      registrationNumber: 'DL 02 LE 8899',
      type: 'SUV',
      seatingCapacity: 7,
      fuelType: 'Diesel',
      transmission: 'Automatic',
      dailyRate: 5800,
      perKmRate: 24,
      features: ['4x4 Terrain Mode', 'JBL Sound System', 'Ventilated Seats', 'Wireless Charging'],
      servicedCities: ['Delhi', 'Jaipur', 'Agra'],
      description: 'Power-packed 4x4 executive SUV, ready for rugged terrain and VIP escort trips.',
      documents: {
        rcDocument: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800',
        insurancePolicy: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=800',
        pucCertificate: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800',
      },
      conditionReport: {
        photos: {
          front: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
          rear: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800',
          left: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800',
          right: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
          interior: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800',
          dashboard: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800',
          odometer: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
          numberPlate: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800',
        },
        odometerReading: 9800,
        existingDamageNotes: 'Spotless, brand new delivery last month.',
      },
      status: 'pending_approval', // Pending admin verification!
      isAllocated: false,
      isAvailable: true,
      rating: 5.0,
      totalTrips: 0,
    });

    console.log('[Seeder]: Creating Initial Bookings...');
    // Booking 1: Confirmed & Allocated
    const b1 = await Booking.create({
      bookingId: 'GE-2026-1024',
      user: user1._id,
      owner: owner1._id,
      vehicle: v1._id,
      route: {
        fromCity: 'Delhi',
        toCity: 'Jaipur',
        pickupAddress: 'Terminal 3, IGI Airport, New Delhi',
        dropAddress: 'Hotel Clarks Amer, JLN Marg, Jaipur',
      },
      dates: {
        pickupDate: new Date(Date.now() + 1 * 86400000),
        dropDate: new Date(Date.now() + 3 * 86400000),
        pickupTime: '06:30 AM',
        totalDays: 2,
      },
      seaterRequired: 7,
      passengersCount: 5,
      status: 'allocated',
      pricing: {
        dailyRate: 3800,
        estimatedAmount: 7600,
        paymentNote: 'Direct settlement / Internal billing with Vehicle Owner',
      },
      driverAllocation: {
        driverName: 'Surender Singh',
        driverPhone: '+91 98109 98877',
        assignedVehicleReg: 'DL 01 AA 1024',
        allocatedAt: new Date(),
      },
      specialRequests: 'Need early morning pickup from airport with roof luggage carrier.',
    });

    // Booking 2: Pending Confirmation
    const b2 = await Booking.create({
      bookingId: 'GE-2026-3081',
      user: user2._id,
      owner: owner1._id,
      vehicle: v2._id,
      route: {
        fromCity: 'Delhi',
        toCity: 'Agra',
        pickupAddress: 'Connaught Place, Central Delhi',
        dropAddress: 'Taj East Gate Road, Agra',
      },
      dates: {
        pickupDate: new Date(Date.now() + 2 * 86400000),
        dropDate: new Date(Date.now() + 3 * 86400000),
        pickupTime: '07:00 AM',
        totalDays: 1,
      },
      seaterRequired: 7,
      passengersCount: 4,
      status: 'pending',
      pricing: {
        dailyRate: 2800,
        estimatedAmount: 2800,
        paymentNote: 'Direct settlement / Internal billing with Vehicle Owner',
      },
      specialRequests: 'Family day trip to Taj Mahal.',
    });

    // Booking 3: Completed
    const b3 = await Booking.create({
      bookingId: 'GE-2026-5590',
      user: user1._id,
      owner: owner2._id,
      vehicle: v3._id,
      route: {
        fromCity: 'Bengaluru',
        toCity: 'Coorg',
        pickupAddress: 'Indiranagar 100ft Road, Bengaluru',
        dropAddress: 'Madikeri Town, Coorg',
      },
      dates: {
        pickupDate: new Date(Date.now() - 5 * 86400000),
        dropDate: new Date(Date.now() - 3 * 86400000),
        pickupTime: '05:30 AM',
        totalDays: 2,
      },
      seaterRequired: 7,
      passengersCount: 6,
      status: 'completed',
      pricing: {
        dailyRate: 4600,
        estimatedAmount: 9200,
        paymentNote: 'Settled directly with driver upon trip end.',
      },
      driverAllocation: {
        driverName: 'Manjunath Swamy',
        driverPhone: '+91 94490 12345',
        assignedVehicleReg: 'KA 05 MN 9921',
        allocatedAt: new Date(Date.now() - 5 * 86400000),
      },
    });

    console.log('[Seeder]: Database successfully populated with realistic MVP data!');
    return {
      adminEmail: admin.email,
      ownerEmail: owner1.email,
      userEmail: user1.email,
      vehiclesSeeded: 6,
      bookingsSeeded: 3,
    };
  } catch (error) {
    console.error('[Seeder Error]:', error);
    throw error;
  }
};

if (require.main === module) {
  seedDatabase().then(() => {
    console.log('[Seeder]: Done! Exiting.');
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = {
  seedDatabase,
};
