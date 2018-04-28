<?php
class Authorize
{
	var $Site = 'WSS';

	function Authorize()
	{
	}

	function Login($user,$pass,$location = '')
	{
		$query = "SELECT * FROM user WHERE user_name = '$user' AND user_pass = '".md5($pass)."'";
		$result = db_query($query);
		$num = db_num_rows($result);
		if( $num > 0 )
		{
			$row = db_fetch_assoc($result);
			$_SESSION['Auth_id_'.$this->Site] = $row['user_id'];
			$_SESSION['Auth_type_'.$this->Site] = $row['user_type'];
			$_SESSION['Auth_company_'.$this->Site] = $row['company_id'];
			$_SESSION['Auth_user_'.$this->Site] = $row['user_name'];
			$_SESSION['Auth_name_'.$this->Site] = $row['user_firstname'].' '.$row['user_lastname'];
			$_SESSION['Auth_pass_'.$this->Site] = $row['user_pass'];
			$_SESSION['Auth_time_'.$this->Site] = date('d/m/Y H:i:s');
			if(isset($_SESSION['Auth_url_'.$this->Site]) && $_SESSION['Auth_url_'.$this->Site] != '')
			{
		//		echo '<meta http-equiv="refresh" content="0;url='.$_SESSION['Auth_url_'.$this->Site].'">';
				return true;
				//exit;
			}
			else
			{
				if($location != '')
				{
			//		echo '<meta http-equiv="refresh" content="0;url='.$location.'">';
					return true;
					//exit;
				}
			}
		}
		else
		{
			$this->Logout();
			return false;
		}
	}

	function Logout()
	{
		if(isset($_SESSION['Auth_id_'.$this->Site]))
		{
			unset($_SESSION['Auth_id_'.$this->Site]);
			unset($_SESSION['Auth_type_'.$this->Site]);
			unset($_SESSION['Auth_time_'.$this->Site]);
			unset($_SESSION['Auth_user_'.$this->Site]);
			unset($_SESSION['Auth_name_'.$this->Site]);
			unset($_SESSION['Auth_company_'.$this->Site]);
			unset($_SESSION['Auth_pass_'.$this->Site]);
		}
	}

	function IsLoggedOn($location = '')
	{
		if( !isset($_SESSION['Auth_id_'.$this->Site]) )
		{
			if($location != '')
			{
				$_SESSION['Auth_url_'.$this->Site] = $_SERVER['REQUEST_URI'];
				header('Location: '.$location);
				exit;
			}
			else
			{
				return false;
			}
		}
		return true;
	}

	function GetUser() {
		return $_SESSION['Auth_user_'.$this->Site];
	}

	function GetName() {
		return $_SESSION['Auth_name_'.$this->Site];
	}

	function GetCompany() {
		return $_SESSION['Auth_company_'.$this->Site];
	}

	function GetType() {
		return $_SESSION['Auth_type_'.$this->Site];
	}

	function GetPass() {
		return $_SESSION['Auth_pass_'.$this->Site];
	}

	function GetEmail() {
		return $_SESSION['Auth_email_'.$this->Site];
	}

	function GetId(){
		return $_SESSION['Auth_id_'.$this->Site];
	}

	function GetLoginTime(){
		return $_SESSION['Auth_time_'.$this->Site];
	}

	function GetData(){
		$query = "SELECT * FROM user WHERE user_id = '".$_SESSION['Auth_id_'.$this->Site]."'";
		$result = db_query($query);
		if($row = db_fetch_assoc($result)){
			return $row;
		}
		else
		{
			return array();
		}
	}
}
?>
