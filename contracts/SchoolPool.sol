// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SchoolPool is ReentrancyGuard, Ownable {
    
    struct Pool {
        uint256 id;
        uint256 schoolId;
        string schoolName;
        string goal;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 deadline;
        bool active;
        bool completed;
        address[] contributors;
        mapping(address => uint256) contributions;
    }
    
    struct PoolInfo {
        uint256 id;
        uint256 schoolId;
        string schoolName;
        string goal;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 deadline;
        bool active;
        bool completed;
        uint256 contributorCount;
    }
    
    uint256 public poolCount;
    mapping(uint256 => Pool) private pools;
    mapping(uint256 => mapping(address => uint256)) public poolContributions;
    mapping(uint256 => address[]) public poolContributors;
    
    event PoolCreated(uint256 indexed poolId, uint256 indexed schoolId, string goal, uint256 targetAmount, uint256 deadline);
    event ContributionMade(uint256 indexed poolId, address indexed contributor, uint256 amount);
    event PoolCompleted(uint256 indexed poolId, uint256 totalAmount);
    event FundsWithdrawn(uint256 indexed poolId, address indexed recipient, uint256 amount);
    
    constructor() Ownable(msg.sender) {}
    
    function createPool(
        uint256 _schoolId,
        string memory _schoolName,
        string memory _goal,
        uint256 _targetAmount,
        uint256 _durationDays
    ) external onlyOwner returns (uint256) {
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(_durationDays > 0, "Duration must be greater than 0");
        
        poolCount++;
        uint256 deadline = block.timestamp + (_durationDays * 1 days);
        
        Pool storage newPool = pools[poolCount];
        newPool.id = poolCount;
        newPool.schoolId = _schoolId;
        newPool.schoolName = _schoolName;
        newPool.goal = _goal;
        newPool.targetAmount = _targetAmount;
        newPool.currentAmount = 0;
        newPool.deadline = deadline;
        newPool.active = true;
        newPool.completed = false;
        
        emit PoolCreated(poolCount, _schoolId, _goal, _targetAmount, deadline);
        
        return poolCount;
    }
    
    function contribute(uint256 _poolId) external payable nonReentrant {
        require(_poolId > 0 && _poolId <= poolCount, "Invalid pool ID");
        Pool storage pool = pools[_poolId];
        require(pool.active, "Pool is not active");
        require(block.timestamp < pool.deadline, "Pool deadline has passed");
        require(msg.value > 0, "Contribution must be greater than 0");
        require(!pool.completed, "Pool is already completed");
        
        // Track new contributors
        if (poolContributions[_poolId][msg.sender] == 0) {
            poolContributors[_poolId].push(msg.sender);
        }
        
        poolContributions[_poolId][msg.sender] += msg.value;
        pool.currentAmount += msg.value;
        
        emit ContributionMade(_poolId, msg.sender, msg.value);
        
        // Check if target is reached
        if (pool.currentAmount >= pool.targetAmount) {
            pool.completed = true;
            pool.active = false;
            emit PoolCompleted(_poolId, pool.currentAmount);
        }
    }
    
    function withdrawFunds(uint256 _poolId, address payable _recipient) external onlyOwner nonReentrant {
        require(_poolId > 0 && _poolId <= poolCount, "Invalid pool ID");
        Pool storage pool = pools[_poolId];
        require(pool.completed || block.timestamp >= pool.deadline, "Pool not completed or deadline not reached");
        require(pool.currentAmount > 0, "No funds to withdraw");
        
        uint256 amount = pool.currentAmount;
        pool.currentAmount = 0;
        pool.active = false;
        
        _recipient.transfer(amount);
        
        emit FundsWithdrawn(_poolId, _recipient, amount);
    }
    
    function getPoolInfo(uint256 _poolId) external view returns (PoolInfo memory) {
        require(_poolId > 0 && _poolId <= poolCount, "Invalid pool ID");
        Pool storage pool = pools[_poolId];
        
        return PoolInfo({
            id: pool.id,
            schoolId: pool.schoolId,
            schoolName: pool.schoolName,
            goal: pool.goal,
            targetAmount: pool.targetAmount,
            currentAmount: pool.currentAmount,
            deadline: pool.deadline,
            active: pool.active,
            completed: pool.completed,
            contributorCount: poolContributors[_poolId].length
        });
    }
    
    function getActivePools() external view returns (PoolInfo[] memory) {
        uint256 activeCount = 0;
        
        for (uint256 i = 1; i <= poolCount; i++) {
            if (pools[i].active) {
                activeCount++;
            }
        }
        
        PoolInfo[] memory activePools = new PoolInfo[](activeCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= poolCount; i++) {
            if (pools[i].active) {
                Pool storage pool = pools[i];
                activePools[index] = PoolInfo({
                    id: pool.id,
                    schoolId: pool.schoolId,
                    schoolName: pool.schoolName,
                    goal: pool.goal,
                    targetAmount: pool.targetAmount,
                    currentAmount: pool.currentAmount,
                    deadline: pool.deadline,
                    active: pool.active,
                    completed: pool.completed,
                    contributorCount: poolContributors[i].length
                });
                index++;
            }
        }
        
        return activePools;
    }
    
    function getContribution(uint256 _poolId, address _contributor) external view returns (uint256) {
        return poolContributions[_poolId][_contributor];
    }
    
    function getPoolContributors(uint256 _poolId) external view returns (address[] memory) {
        return poolContributors[_poolId];
    }
}
