// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TokenizedTimeTracking {
    string public name = "FreelanceTimeToken";
    string public symbol = "FTT";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    address public owner;
    uint256 public ratePerSecond;
    
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => WorkSession[]) public workSessions;
    
    struct WorkSession {
        address freelancer;
        uint256 startTime;
        uint256 endTime;
        uint256 tokensEarned;
    }
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
    event WorkStarted(address indexed freelancer, uint256 startTime);
    event WorkStopped(address indexed freelancer, uint256 endTime, uint256 tokensEarned);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }
    
    constructor(uint256 _ratePerSecond) {
        owner = msg.sender;
        ratePerSecond = _ratePerSecond;
    }
    
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Insufficient balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }
    
    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[_from] >= _value, "Insufficient balance");
        require(allowance[_from][msg.sender] >= _value, "Allowance exceeded");
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        
        emit Transfer(_from, _to, _value);
        return true;
    }
    
    function mint(address _to, uint256 _value) internal {
        totalSupply += _value;
        balanceOf[_to] += _value;
        emit Transfer(address(0), _to, _value);
    }
    
    function startWork() external {
        require(workSessions[msg.sender].length == 0 || workSessions[msg.sender][workSessions[msg.sender].length - 1].endTime != 0, "Finish previous session first");
        workSessions[msg.sender].push(WorkSession(msg.sender, block.timestamp, 0, 0));
        emit WorkStarted(msg.sender, block.timestamp);
    }
    
    function stopWork() external {
        require(workSessions[msg.sender].length > 0, "No active session");
        WorkSession storage session = workSessions[msg.sender][workSessions[msg.sender].length - 1];
        require(session.endTime == 0, "Work session already stopped");
        
        session.endTime = block.timestamp;
        session.tokensEarned = (session.endTime - session.startTime) * ratePerSecond;
        mint(msg.sender, session.tokensEarned);
        
        emit WorkStopped(msg.sender, session.endTime, session.tokensEarned);
    }
}
