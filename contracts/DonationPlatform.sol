// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DonationPlatform is ReentrancyGuard, Ownable {
    
    struct Student {
        uint256 id;
        string name;
        string location;
        int256 latitude;
        int256 longitude;
        string needs;
        uint256 targetAmount;
        uint256 receivedAmount;
        address payable wallet;
        bool verified;
        bool active;
        uint256 schoolId;
    }
    
    struct Donation {
        uint256 id;
        address donor;
        uint256 studentId;
        uint256 amount;
        uint256 timestamp;
        string message;
        bool disbursed;
    }
    
    struct School {
        uint256 id;
        string name;
        string location;
        int256 latitude;
        int256 longitude;
        address payable wallet;
        uint256 totalReceived;
        uint256 studentCount;
        bool verified;
    }
    
    struct ResourceTracker {
        uint256 studentId;
        string resourceType;
        uint256 beforeCount;
        uint256 afterCount;
        uint256 timestamp;
        string proofIPFSHash;
    }
    
    // State variables
    uint256 public studentCount;
    uint256 public donationCount;
    uint256 public schoolCount;
    uint256 public totalDonated;
    uint256 public resourceTrackerCount;
    
    mapping(uint256 => Student) public students;
    mapping(uint256 => Donation) public donations;
    mapping(uint256 => School) public schools;
    mapping(address => uint256[]) public donorDonations;
    mapping(uint256 => ResourceTracker[]) public studentResources;
    
    // Events
    event StudentAdded(uint256 indexed studentId, string name, uint256 targetAmount);
    event DonationReceived(uint256 indexed donationId, address indexed donor, uint256 indexed studentId, uint256 amount);
    event FundsDisbursed(uint256 indexed studentId, uint256 amount);
    event SchoolAdded(uint256 indexed schoolId, string name, string location);
    event ResourceTracked(uint256 indexed studentId, string resourceType, uint256 beforeCount, uint256 afterCount);
    
    constructor() Ownable(msg.sender) {}
    
    // Add a new school
    function addSchool(
        string memory _name,
        string memory _location,
        int256 _latitude,
        int256 _longitude,
        address payable _wallet
    ) external onlyOwner returns (uint256) {
        schoolCount++;
        
        schools[schoolCount] = School({
            id: schoolCount,
            name: _name,
            location: _location,
            latitude: _latitude,
            longitude: _longitude,
            wallet: _wallet,
            totalReceived: 0,
            studentCount: 0,
            verified: true
        });
        
        emit SchoolAdded(schoolCount, _name, _location);
        return schoolCount;
    }
    
    // Add a new student
    function addStudent(
        string memory _name,
        string memory _location,
        int256 _latitude,
        int256 _longitude,
        string memory _needs,
        uint256 _targetAmount,
        address payable _wallet,
        uint256 _schoolId
    ) external onlyOwner returns (uint256) {
        require(_schoolId <= schoolCount && _schoolId > 0, "Invalid school ID");
        
        studentCount++;
        
        students[studentCount] = Student({
            id: studentCount,
            name: _name,
            location: _location,
            latitude: _latitude,
            longitude: _longitude,
            needs: _needs,
            targetAmount: _targetAmount,
            receivedAmount: 0,
            wallet: _wallet,
            verified: true,
            active: true,
            schoolId: _schoolId
        });
        
        schools[_schoolId].studentCount++;
        
        emit StudentAdded(studentCount, _name, _targetAmount);
        return studentCount;
    }
    
    // Make a donation to a student
    function donate(uint256 _studentId, string memory _message) external payable nonReentrant {
        require(_studentId > 0 && _studentId <= studentCount, "Invalid student ID");
        require(msg.value > 0, "Donation must be greater than 0");
        require(students[_studentId].active, "Student is not active");
        
        donationCount++;
        
        donations[donationCount] = Donation({
            id: donationCount,
            donor: msg.sender,
            studentId: _studentId,
            amount: msg.value,
            timestamp: block.timestamp,
            message: _message,
            disbursed: false
        });
        
        students[_studentId].receivedAmount += msg.value;
        totalDonated += msg.value;
        donorDonations[msg.sender].push(donationCount);
        
        // Update school total
        uint256 schoolId = students[_studentId].schoolId;
        schools[schoolId].totalReceived += msg.value;
        
        emit DonationReceived(donationCount, msg.sender, _studentId, msg.value);
    }
    
    // Disburse funds to student (automated via smart contract)
    function disburseFunds(uint256 _donationId) external nonReentrant onlyOwner {
        require(_donationId > 0 && _donationId <= donationCount, "Invalid donation ID");
        require(!donations[_donationId].disbursed, "Already disbursed");
        
        Donation storage donation = donations[_donationId];
        Student storage student = students[donation.studentId];
        
        require(student.active, "Student is not active");
        
        donation.disbursed = true;
        student.wallet.transfer(donation.amount);
        
        emit FundsDisbursed(donation.studentId, donation.amount);
    }
    
    // Track resource improvement (before/after)
    function trackResource(
        uint256 _studentId,
        string memory _resourceType,
        uint256 _beforeCount,
        uint256 _afterCount,
        string memory _proofIPFSHash
    ) external onlyOwner {
        require(_studentId > 0 && _studentId <= studentCount, "Invalid student ID");
        
        ResourceTracker memory tracker = ResourceTracker({
            studentId: _studentId,
            resourceType: _resourceType,
            beforeCount: _beforeCount,
            afterCount: _afterCount,
            timestamp: block.timestamp,
            proofIPFSHash: _proofIPFSHash
        });
        
        studentResources[_studentId].push(tracker);
        resourceTrackerCount++;
        
        emit ResourceTracked(_studentId, _resourceType, _beforeCount, _afterCount);
    }
    
    // Get all donations for a donor
    function getDonorDonations(address _donor) external view returns (uint256[] memory) {
        return donorDonations[_donor];
    }
    
    // Get student resources
    function getStudentResources(uint256 _studentId) external view returns (ResourceTracker[] memory) {
        return studentResources[_studentId];
    }
    
    // Get donation details
    function getDonation(uint256 _donationId) external view returns (Donation memory) {
        return donations[_donationId];
    }
    
    // Get student details
    function getStudent(uint256 _studentId) external view returns (Student memory) {
        return students[_studentId];
    }
    
    // Get school details
    function getSchool(uint256 _schoolId) external view returns (School memory) {
        return schools[_schoolId];
    }
    
    // Get all active students (for frontend display)
    function getActiveStudents() external view returns (Student[] memory) {
        uint256 activeCount = 0;
        
        for (uint256 i = 1; i <= studentCount; i++) {
            if (students[i].active) {
                activeCount++;
            }
        }
        
        Student[] memory activeStudents = new Student[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= studentCount; i++) {
            if (students[i].active) {
                activeStudents[index] = students[i];
                index++;
            }
        }
        
        return activeStudents;
    }
    
    // Get platform statistics
    function getStats() external view returns (
        uint256 _totalDonated,
        uint256 _donationCount,
        uint256 _studentCount,
        uint256 _schoolCount
    ) {
        return (totalDonated, donationCount, studentCount, schoolCount);
    }
}
