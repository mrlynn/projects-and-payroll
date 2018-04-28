<form name="pageform" method="GET" action="<?php echo $_SERVER['PHP_SELF'];?>">
<?php
foreach($_GET as $key => $value){
	if($key != 'action' && $key != 'letter' && $key != 'page'){
		echo '<input type="hidden" name="'.$key.'" value="'.$value.'">';
	}
}
?>
<input type="hidden" name="action" value="view">
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
&nbsp;&nbsp;&nbsp;Page
<select ONCHANGE="document.pageform.submit();" name="page" size="1" class="formtext">
<?php
for($i = 1; $i <= TOTAL_PAGES; $i++) {
	if($i == CURRENT_PAGE){
		echo '<option value="'.$i.'" SELECTED>'.$i.'</option>';
	}else{
		echo '<option value="'.$i.'">'.$i.'</option>';
	}
}
?>
</select>
of <?php echo TOTAL_PAGES;?>
</form>