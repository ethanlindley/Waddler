class com.clubpenguin.crypto.ZASETH
{
	function ZASETH(){}

	static function encryptZaseth(str, key)
	{
		var keyIndex = 0x00, keyResult = "", res = "";
		for (var i = 0x00; i < str.length; i++)
		{
			var charCode = str.charCodeAt(i);
			charCode ^= key.charCodeAt(keyIndex);
			var firstChar = charCode & 0x0F, secondChar = charCode >> 0x04;
			res += String.fromCharCode(firstChar + 0x40), res += String.fromCharCode(secondChar + 0x40);
			keyIndex++;
			if (keyIndex >= key.length)
			{
				keyIndex = 0x00;
			}
		}
		return res;
	}
}