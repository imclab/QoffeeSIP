##
# @source: https://github.com/Quobis/QoffeeSIP
# Copyright (C) Quobis
# Licensed under GNU-LGPL-3.0-or-later (http://www.gnu.org/licenses/lgpl-3.0.html)
##

# In this class we use WebRTC API described here: http://dev.w3.org/2011/webrtc/editor/webrtc.html
class RTC extends Spine.Controller
	constructor: () ->
		super
		console.log "[INFO] RTC constructor"
		if @mediaElements?
			@$dom1 = @mediaElements.localMedia
			@$dom2 = @mediaElements.remoteMedia
		else
			@$dom1 = @$dom2 = null

		@mediaConstraints ?= {audio: true, video: true}
		@browserSupport()
		@start()

	# Set some object attributes dependeing on browser.
	browserSupport: () =>
		# If firefox.
		if navigator.mozGetUserMedia
			# Browser name
			@browser               = "firefox" 
			# GetUserMedia, PeerConnection, RTCSessionDescription and RTCIceCandidate (different prefix)
			@getUserMedia          = navigator.mozGetUserMedia.bind navigator
			@PeerConnection        = mozRTCPeerConnection
			@RTCSessionDescription = mozRTCSessionDescription
			@attachStream          = ($dom, stream) ->
				return if not $dom?
				console.log "[INFO] attachStream"
				$d = $($dom.find("video")[0])
				$d.attr 'mozSrcObject', stream
				$d.get(0).play()
				$d.parent().css {opacity: 1}

			# Fake get{Video,Audio}Tracks
			MediaStream.prototype.getVideoTracks = () -> return []
			MediaStream.prototype.getAudioTracks = () -> return []

		if navigator.webkitGetUserMedia
			# Browser name			
			@browser               = "chrome"
			# GetUserMedia, PeerConnection, RTCSessionDescription and RTCIceCandidate (different prefix)
			@getUserMedia          = navigator.webkitGetUserMedia.bind navigator
			@PeerConnection        = webkitRTCPeerConnection
			@RTCSessionDescription = RTCSessionDescription
			@attachStream          = ($dom, stream) =>
				return if not $dom?
				console.log "[INFO] attachStream"
				$d = $($dom.find("video")[0])
				# Builds a URL from a stream to be able to attach it to the DOM element
				# passed as parameter.
				url =  webkitURL.createObjectURL stream
				$d.attr 'src', url
				$d.parent().css {opacity: 1}

			# The representation of tracks in a stream is changed in M26.
			# Unify them for earlier Chrome versions in the coexisting period.
			 if not webkitMediaStream.prototype.getVideoTracks
			    webkitMediaStream.prototype.getVideoTracks = () ->
			      return this.videoTracks;
			 if not webkitMediaStream.prototype.getAudioTracks
			    webkitMediaStream.prototype.getAudioTracks = () ->
			      return this.audioTracks;

			# New syntax of getXXXStreams method in M26.
			if not webkitRTCPeerConnection.prototype.getLocalStreams
				webkitRTCPeerConnection.prototype.getLocalStreams  = -> return this.localStreams;
				webkitRTCPeerConnection.prototype.getRemoteStreams = -> return this.remoteStreams;

	start: () =>
		# Firefox does not provide *onicecandidate* callback.
		@noMoreCandidates = false or @browser is "firefox"
		@createPeerConnection()

	createPeerConnection: =>
		console.log "[INFO] createPeerConnection"
		# We must provide at least one stun/turn server as parameter. 
		# If the server is not reacheable by browser, peerconnection can only get host candidates.
		@pc = new @PeerConnection "iceServers": ["url": "stun:74.125.132.127:19302"]
		
		# When we receive remote media (RTP from the other peer), attach it to the DOM element.
		@pc.onaddstream = (event) =>
			console.log "[MEDIA] Stream added"
			@trigger "info", "remotestream"
			@attachStream @$dom2, event.stream 

		# When a new ice candidate is received and it's not null, we'll show it in the console.
		# If we receive a null candidate, if means the candidate gathering process is finished;
		# so we just have to wait for the SDP to be avaliable. If it's already avaliable, we
		# trigger the SDP event.
		@pc.onicecandidate = (evt, moreToFollow) =>
			console.log "[INFO] onicecandidate"
			console.log @pc.iceState
			if evt.candidate
				console.log "[INFO] New ICE candidate:"
				candidate =
					type: 'candidate'
					label: evt.candidate.sdpMLineIndex
					id: evt.candidate.sdpMid
					candidate: evt.candidate.candidate
				console.log "#{candidate.candidate}"
			else
				console.log "[INFO] No more ice candidates"
				@noMoreCandidates = true
				# If we don't expect more ice candidates and the local description is 
				# set, send the sdp (fire the "sdp" event).
				@triggerSDP() if @pc.localDescription?
					
		# PeerConnections events just to log them (only chrome).
		if @browser is "chrome"
			@pc.onicechange = (event) => console.log "[INFO] icestate changed -> #{@pc.iceState}"
			@pc.onstatechange = (event) =>  console.log "[INFO] peerconnectionstate changed -> #{@pc.readyState}"
			@pc.onopen  = -> console.log "[MEDIA] peerconnection opened"
			@pc.onclose = -> console.log "[INFO] peerconnection closed"
		@createStream()

	# This function creates or gets previous media, add it to
	# the PeerConnection and attaches it to the DOM.
	createStream: () =>
		console.log "[INFO] createStream"
		# Localstream already exists, so we just add it to current PeerConnection object.
		if @localstream?
			console.log "[INFO] Using media previously getted."
			@pc.addStream @localstream
			@attachStream @$dom1, @localstream
		# If there is not previous localstream, get it, add it to current PeerConnection object.
		else
			gumSuccess = (stream) =>
				@localstream = stream
				console.log "[INFO] getUserMedia successed"
				console.log stream
				@pc.addStream @localstream
				@attachStream @$dom1, @localstream
				# We trigger an event to be able to bind any behaviour when we get media; for example,
				# to show a popup telling "Media got".
				@trigger "info", "localstream"
			gumFail = (error) =>
				console.log error
				console.log "GetUserMedia error"
				@trigger "error", "getUserMedia"
			# Ask to access hardware.
			# gumSuccess and gumFail are callbacks that will be executed under getUserMedia success and failure executions.
			@getUserMedia @mediaConstraints, gumSuccess, gumFail	

	# # Add a stream to the DOM video.
	# attachStream: ($dom, stream) =>
	# 	return if not $dom?
	# 	console.log "[INFO] attachStream"
	# 	$d = $($dom.find("video")[0])
	# 	# Builds a URL from a stream to be able to attach it to the DOM element
	# 	# passed as parameter.
	# 	url =  (@URL.createObjectURL stream)
	# 	$d.attr 'src', url
	# 	$d.parent().css {opacity: 1}

	# Gets localDescription and trigger it in the "sdp" event.
	triggerSDP: () =>
		console.log "[MEDIA]"
		sdp = @pc.localDescription.sdp
		@trigger "sdp", sdp

	# Set local description and trigger "sdp" event if 
	setLocalDescription: (sessionDescription, callback) =>
		success = =>
			console.log "[INFO] setLocalDescription successed"
			# If we have all ice candidates and local description set, sdp is ready.
			@triggerSDP() if @noMoreCandidates
				
		fail = => @trigger "error", "setLocalDescription", sessionDescription
		# success and fail are callbacks that will be called on success or fail cases.
		@pc.setLocalDescription sessionDescription, success, fail

	# Creates the sdp and set as localDescription.
	# This function will be called when we are the caller.
	createOffer: () =>
		console.log "[INFO] createOffer"
		error = (e) => @trigger "error", "createOffer", e
		@pc.createOffer @setLocalDescription, error, {}

	# Creates the sdp and set as localDescription.
	# This function will be called when we are the callee.
	# This function will fail if there is not remoteDescription.
	createAnswer: () =>
		console.log "[INFO] createAnswer"
		error = (e) =>  @trigger "error", "createAnswer", e
		@pc.createAnswer @setLocalDescription, error, {}

	# Generic function to receive both, SDP offer and answer.
	# It will be called from *receiveOffer* and *receiveAnswer*.
	receive: (sdp, type, callback = -> null) =>
		success = =>
			console.log "[INFO] Remote description setted."
			console.log "[INFO] localDescription:"
			console.log @pc.localDescription
			console.log "[INFO] remotelocalDescription:"
			console.log @pc.remoteDescription	
			callback()


		description = (new @RTCSessionDescription type: type, sdp: sdp)
		@pc.setRemoteDescription description, success, => @trigger "error", "setRemoteDescription", description


	# Receive SDP offer.
	# Set remoteDescription.
	receiveOffer: (sdp, callback = null) =>
		console.log "[INFO] Received offer"
		@receive(sdp,"offer",callback)
	
	# Receive SDP answer.
	# Set remoteDescription.
	receiveAnswer: (sdp) =>
		console.log "[INFO] Received answer"
		@receive(sdp,"answer")

	# Close PeerConnection and reset it with *start*.
	close: () =>
		# Hide remote video.
		@$dom2.animate opacity: 0 if @$dom2?
		# Closing PeerConnection fails if the PeerConnection is not opened.
		try
			@pc.close()
		catch e
			console.log "[ERROR] Error closing peerconnection"
			console.log e
		finally
			@pc = null
			@start()

	# # options :: {audio, video}
	# setMediaConstraints: (options) =>
	# 	console.log "[MEDIA]"
	# 	console.log options

	# 	@mediaConstraints =
	# 		mandatory:
	# 			'OfferToReceiveAudio': options.audio
	# 			'OfferToReceiveVideo': options.video

window.RTC = RTC