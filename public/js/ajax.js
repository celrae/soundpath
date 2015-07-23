(function(){

    window.ajax = {
        socket: null,
        waitLevel: 0,

        waitDiv: $('<div class="modal" id="pleaseWaitDialog" data-backdrop="static" data-keyboard="false"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="modal-body"><div class="clearfix"><div class="pull-left"><h3>Please Wait...</h3></div> <div class="pull-right"><img src="/images/load.gif" /></div></div></div></div></div></div>'),

        showWait: function() {
            var self = this;

            self.waitLevel++;

            if($('#pleaseWaitDialog').hasClass('in')) {
                return;
            }

            self.waitDiv.modal();
        },

        hideWait: function() {
            var self = this;

            self.waitLevel--;
            if(self.waitLevel === 0) {
                self.waitDiv.modal('hide');
            }
        },

        loadURL: function(url, container, showWait, onSuccess, onError, onComplete) {
        	var self = this;
            container = container || $("#content");

	        $.ajax({
		        type : "GET",
		        url : url,
		        dataType : 'html',
		        beforeSend : function() {
                    if(showWait) {
                        self.showWait();
                    }
			        if (container[0] == $("#main-content")[0]) {
				        // scroll up
				        $("html, body").animate({
					        scrollTop : 0
				        }, "fast");
			        } else {
				        container.animate({
					        scrollTop : 0
				        }, "fast");
			        }
		        },
		        success : function(data) {
			        container.css({
				        opacity : '0.0'
			        }).html(data).delay(50).animate({
				        opacity : '1.0'
			        }, 300);
		        },
		        error : function(xhr, status, error) {
                    if(onError) {
                        onError(xhr.responseText);
                    } else {
                        window.ajax.addError(xhr.responseText);
                    }           
		        },
                complete: function() {
                    if(showWait) {
                        self.hideWait();
                    }
                    $('#status').html('');
                }        
	        });
        },

       getScript: function(url, showWait, onSuccess, onError, onComplete) {
	        var self = this;

	        $.ajax({
		        type : "GET",
		        url : url,
		        dataType : 'script',
		        beforeSend : function() {
                    if(showWait) {
                        self.showWait();
                    }
                },
		        success : function(data) {  
                        if(onSuccess) {
                            onSuccess(data);
                        }                               
		        },
		        error : function(xhr, status, error) {
                    if(onError) {
                        onError(xhr.responseText);
                    } else {
                        window.ajax.addError(xhr.responseText);
                    }           
		        },
                complete: function() {
                    if(showWait) {
                        self.hideWait();
                    }
                    if(onComplete) {
                        onComplete();
                    }
                }
	        });            
        },

        getText: function(url, data, showWait, onSuccess, onError, onComplete) {
	        var self = this;

	        $.ajax({
		        type : "GET",
		        url : url,
                data: data,
		        dataType : 'text',
		        beforeSend : function() {
                    if(showWait) {
                        self.showWait();
                    }
                },
		        success : function(data) {  
                        if(onSuccess) {
                            onSuccess(data);
                        }                               
		        },
		        error : function(xhr, status, error) {
                    if(onError) {
                        onError(xhr.responseText);
                    } else {
                        window.ajax.addError(xhr.responseText);
                    }           
		        },
                complete: function() {
                    if(showWait) {
                        self.hideWait();
                    }
                    if(onComplete) {
                        onComplete();
                    }
                }
	        });            
        },

        getHTML: function(url, data, showWait, onSuccess, onError, onComplete) {
	        var self = this;

	        $.ajax({
		        type : "GET",
		        url : url,
                data: data,
		        dataType : 'html',
		        beforeSend : function() {
                    if(showWait) {
                        self.showWait();
                    }
                },
		        success : function(data) {  
                        if(onSuccess) {
                            onSuccess(data);
                        }                               
		        },
		        error : function(xhr, status, error) {
                    if(onError) {
                        onError(xhr.responseText);
                    } else {
                        window.ajax.addError(xhr.responseText);
                    }           
		        },
                complete: function() {
                    if(showWait) {
                        self.hideWait();
                    }
                    if(onComplete) {
                        onComplete();
                    }
                }
	        });            
        },

        getJSON: function(url, data, showWait, onSuccess, onError, onComplete ) {
            var self = this;

	        $.ajax({
		        type : "GET",
		        url : url,
                data: data,
		        dataType : 'json',
		        beforeSend : function() {
                    if(showWait) {
                        self.showWait();
                    }
                },
		        success : function(data) {             
                        if(onSuccess) {
                            onSuccess(data);
                        }
		        },
		        error : function(xhr, status, error) {
                    if(onError) {
                        onError(xhr.responseText);
                    } else {
                        self.addError(xhr.responseText);
                    }           
		        },
                complete: function() {
                    if(showWait) {
                        self.hideWait();
                    }
                    if(onComplete) {
                        onComplete();
                    }
                }
	        });
        },

        post: function(url, data, showWait, onSuccess, onError, onComplete ) {
	        var self = this;

	        $.ajax({
		        type : "POST",
		        url : url,
                data: data,
		        dataType : 'json',
		        beforeSend : function() {
                    if(showWait) {
                        self.showWait();
                    }
                },
		        success : function(data) {
                    if(onSuccess) {
                        onSuccess(data);
                    } 
		        },
		        error : function(xhr, status, error) {
                    if(onError) {
                        onError(xhr.responseText);
                    } else {
                        window.ajax.addError(xhr.responseText);
                    }           
		        },
                complete: function() {
                    if(showWait) {
                        self.hideWait();
                    }
                    if(onComplete) {
                        onComplete();
                    }
                }
	        });
        },

        upload: function(url, file, showWait, onProgress, onSuccess, onError, onComplete ) {
	        var self = this;

            var reader = new FileReader();  

            var xhr = new XMLHttpRequest();
            
            if(onProgress) {
                xhr.upload.addEventListener("progress", function(e) {
                    if (e.lengthComputable) {
                        var percentage = Math.round((e.loaded * 100) / e.total);
                        onProgress(percentage);
                    }
                }, false);
            }
  
            xhr.upload.addEventListener("load", function(data){
                if(onProgress) { onProgress(100); }
                if(showWait) { self.hideWait(); }
                if(onSuccess) { onSuccess(data); }
                if(onComplete) { return onComplete(); }  
            }, false);
            
           
            xhr.addEventListener("error", function(evt) { 
                if(onError) { return onError(evt); }
                if(onComplete) { return onComplete(); }                  
            }, false);

            xhr.addEventListener("abort", function(evt){ 
                if(onError) { return onError(evt); } 
                if(onComplete) { return onComplete(); } 
            }, false);

            if(showWait) {
                self.showWait();
            }

            xhr.open("POST", url);
            xhr.setRequestHeader('Content-Type', 'application/octet-stream');
            //xhr.overrideMimeType('application/octet-stream');
            reader.onload = function(evt) {
                xhr.send(evt.target.result);
            };

            reader.readAsBinaryString(file);
        },

        uploadFile: function(url, file, showWait, onSuccess, onError, onComplete ) {
            var self = this;

            // Uploading - for Firefox, Google Chrome and Safari
            xhr = new XMLHttpRequest(); 
            // Update progress bar
 
            // Upload Complete
            xhr.addEventListener("load", function (evt) {
                if(onSuccess) {
                    onSuccess(JSON.parse(evt.target.responseText));
                }
            }, false);


            xhr.addEventListener("error", function(evt){ if(onError) { return onError(evt); } }, false);
            xhr.addEventListener("abort", function(evt){ if(onError) { return onError(evt); } }, false);
 
            xhr.open("post", url, true);
 
            // Set appropriate headers
            xhr.setRequestHeader("Content-Type", "multipart/form-data");
            xhr.setRequestHeader("X-File-Name", file.name);
            xhr.setRequestHeader("X-File-Size", file.size);
            xhr.setRequestHeader("X-File-Type", file.type);
 
            xhr.send(file);
        },
        addError: function(error) {
	        var self = this;	        
           
	        $("#status").html(error);
        }

    }


})();