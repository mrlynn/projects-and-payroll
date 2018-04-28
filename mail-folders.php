<?php

$node = "";

if (isset($_REQUEST["node"])) {
	$node = $_REQUEST["node"];
}

if ($node == 'mailbox') {
  echo "[{id: 0,text: 'Drafts'},{id: 1,text: 'Inbox'},{id: 2,text: 'Junk E-mail'},{id: 3,text: 'Sent Items'}]";
}

?>
